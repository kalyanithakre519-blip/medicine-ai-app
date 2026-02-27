from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from schemas import SupplierCreate, SupplierDB
from database import suppliers_collection
from auth import get_current_user, get_admin_user
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional
    
router = APIRouter()

@router.get("", response_model=List[SupplierDB])
async def read_suppliers(current_user: dict = Depends(get_current_user)):
    suppliers = await suppliers_collection.find().to_list(100)
    for s in suppliers:
        if "_id" in s:
            s["_id"] = str(s["_id"])
    return suppliers

@router.post("", response_model=SupplierDB)
async def create_supplier(supplier: SupplierCreate, current_user: dict = Depends(get_current_user)):
    existing = await suppliers_collection.find_one({"email": supplier.email})
    if existing:
        raise HTTPException(status_code=400, detail="Supplier exists")
    
    supplier_dict = supplier.dict()
    result = await suppliers_collection.insert_one(supplier_dict)
    
    created = await suppliers_collection.find_one({"_id": result.inserted_id})
    if created:
        created["_id"] = str(created["_id"])
    return created

@router.delete("/{id}")
async def delete_supplier(id: str, current_user: dict = Depends(get_admin_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    result = await suppliers_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return {"message": "Supplier removed"}
        
    raise HTTPException(status_code=404, detail="Supplier not found")
