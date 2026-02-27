from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "pharmacist"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserDB(UserBase):
    id: Optional[str] = Field(alias="_id", default=None)
    created_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class MedicineBase(BaseModel):
    name: str
    description: Optional[str] = None
    manufacturer: Optional[str] = None
    category: str
    price: float
    stock: int
    expiryDate: str # Keep simple string to match frontend '2025-10-10'
    batchNumber: Optional[str] = None
    barcode: Optional[str] = None
    supplier: Optional[str] = None
    reorderLevel: int = 10
    imageUrl: Optional[str] = None

class MedicineCreate(MedicineBase):
    pass

class MedicineDB(MedicineBase):
    id: Optional[str] = Field(alias="_id", default=None)
    user: Optional[str] = None # User who added it
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class SupplierBase(BaseModel):
    name: str
    contactPerson: Optional[str] = None
    email: EmailStr
    phone: str
    address: Optional[str] = None
    status: str = "Active"

class SupplierCreate(SupplierBase):
    pass

class SupplierDB(SupplierBase):
    id: Optional[str] = Field(alias="_id", default=None)
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class BillItem(BaseModel):
    medicine: str
    name: str
    quantity: int
    price: float
    amount: float

class BillCreate(BaseModel):
    customerName: str
    customerPhone: Optional[str] = None
    items: List[BillItem]
    totalAmount: float

class BillDB(BillCreate):
    id: Optional[str] = Field(alias="_id", default=None)
    pharmacist: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class Token(BaseModel):
    access_token: str
    token_type: str

class PatientCreate(BaseModel):
    name: str
    phone: str
    condition: str
    medicine: str
    lastBought: str # ISO Date string 
    daysSupply: int
    fruitRecommendation: Optional[str] = "Citrus Fruits"
    waterIntake: Optional[str] = "3-4 Liters"
    dietaryRestrictions: Optional[str] = "Avoid High Sugar/Salt"

class PatientDB(PatientCreate):
    id: Optional[str] = Field(alias="_id", default=None)
    user: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
