from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from schemas import PatientCreate, PatientDB
from database import patients_collection
from auth import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("", response_model=PatientDB)
async def add_patient(patient: PatientCreate, current_user: dict = Depends(get_current_user)):
    print(f"DEBUG: add_patient received for user: {current_user.get('email')}")
    try:
        patient_dict = patient.dict()
        patient_dict["user"] = current_user["id"]
        patient_dict["created_at"] = datetime.utcnow()
        print(f"DEBUG: Inserting patient: {patient_dict['name']}")
        
        # Insert into DB
        result = await patients_collection.insert_one(patient_dict)
        
        created_patient = await patients_collection.find_one({"_id": result.inserted_id})
        if created_patient:
            created_patient["_id"] = str(created_patient["_id"])
        return created_patient
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[PatientDB])
async def get_patients(current_user: dict = Depends(get_current_user)):
    try:
        patients = await patients_collection.find({"user": current_user["id"]}).sort("_id", -1).to_list(100)
        for p in patients:
            p["_id"] = str(p["_id"])
        return patients
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{patient_id}")
async def delete_patient(patient_id: str, current_user: dict = Depends(get_current_user)):
    try:
        if not ObjectId.is_valid(patient_id):
            raise HTTPException(status_code=400, detail="Invalid Patient ID")
            
        patient = await patients_collection.find_one({"_id": ObjectId(patient_id)})
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
            
        if str(patient["user"]) != current_user["id"]:
            raise HTTPException(status_code=401, detail="Not authorized to delete this patient")
            
        await patients_collection.delete_one({"_id": ObjectId(patient_id)})
        return {"message": "Patient removed"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
