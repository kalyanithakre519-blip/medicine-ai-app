from fastapi import APIRouter, Depends, HTTPException
from typing import List
from schemas import BillCreate, BillDB
from database import bills_collection, medicines_collection
from auth import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.get("", response_model=List[BillDB])
async def read_bills(current_user: dict = Depends(get_current_user)):
    bills = await bills_collection.find().sort("created_at", -1).to_list(100)
    for bill in bills:
        if "_id" in bill:
            bill["_id"] = str(bill["_id"])
    return bills

@router.post("", response_model=BillDB)
async def create_bill(bill: BillCreate, current_user: dict = Depends(get_current_user)):
    try:
        if not bill.items:
            raise HTTPException(status_code=400, detail="No items in bill")
        
        bill_dict = bill.dict()
        bill_dict["pharmacist"] = current_user["id"]
        bill_dict["created_at"] = datetime.utcnow()
        
        # Insert Bill
        result = await bills_collection.insert_one(bill_dict)
        
        # Update Stock
        for item in bill.items:
            # Assuming item.medicine is the ID
            med_id = item.medicine
            if ObjectId.is_valid(med_id):
                 await medicines_collection.update_one(
                     {"_id": ObjectId(med_id)},
                     {"$inc": {"stock": -item.quantity}}
                 )
        
        created_bill = await bills_collection.find_one({"_id": result.inserted_id})
        if created_bill:
            created_bill["_id"] = str(created_bill["_id"])
        return created_bill
    except Exception as e:
        import traceback
        print(f"ERROR in create_bill: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
