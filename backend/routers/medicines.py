from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from schemas import MedicineCreate, MedicineDB
from database import medicines_collection
from auth import get_current_user, get_admin_user
from bson import ObjectId
from datetime import datetime
from typing import Optional

router = APIRouter()

@router.get("", response_model=List[MedicineDB])
async def get_medicines(current_user: dict = Depends(get_current_user)):
    print(f"DEBUG: get_medicines called by user: {current_user.get('email')}")
    cursor = medicines_collection.find({}).sort("_id", -1)
    medicines = await cursor.to_list(length=1000)
    
    # Convert ObjectId to string to match MedicineDB schema
    for med in medicines:
        if "_id" in med:
            med["_id"] = str(med["_id"])
    return medicines

@router.post("")
async def create_medicine(medicine: MedicineCreate, current_user: dict = Depends(get_current_user)):
    print(f"DEBUG: Creating medicine: {medicine.name} for user: {current_user.get('email')}")
    medicine_dict = medicine.dict()
    medicine_dict["user"] = current_user["id"]
    medicine_dict["created_at"] = datetime.utcnow()
    
    try:
        result = await medicines_collection.insert_one(medicine_dict)
        created_medicine = await medicines_collection.find_one({"_id": result.inserted_id})
        
        # Convert ObjectId to string for JSON serialization
        if created_medicine and "_id" in created_medicine:
            created_medicine["_id"] = str(created_medicine["_id"])
            created_medicine["id"] = created_medicine["_id"]
            
        print(f"DEBUG: Medicine created with ID: {result.inserted_id}")
        return created_medicine
    except Exception as e:
        print(f"ERROR: Failed to insert medicine: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{id}", response_model=MedicineDB)
async def update_medicine(id: str, medicine: MedicineCreate, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
         raise HTTPException(status_code=400, detail="Invalid ID")

    # In Mongoose we did fetch then update. Here allows update directly.
    update_result = await medicines_collection.update_one(
        {"_id": ObjectId(id)}, {"$set": medicine.dict(exclude_unset=True)}
    )

    if update_result.modified_count == 1:
        updated_medicine = await medicines_collection.find_one({"_id": ObjectId(id)})
        if updated_medicine and "_id" in updated_medicine:
            updated_medicine["_id"] = str(updated_medicine["_id"])
            updated_medicine["id"] = updated_medicine["_id"]
        return updated_medicine
    
    existing_medicine = await medicines_collection.find_one({"_id": ObjectId(id)})
    if existing_medicine:
        return existing_medicine
        
    raise HTTPException(status_code=404, detail="Medicine not found")

@router.delete("/{id}")
async def delete_medicine(id: str, current_user: dict = Depends(get_current_user)): # Ideally admin only
    if not ObjectId.is_valid(id):
         raise HTTPException(status_code=400, detail="Invalid ID")
         
    delete_result = await medicines_collection.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Medicine removed"}
    
    raise HTTPException(status_code=404, detail="Medicine not found")
