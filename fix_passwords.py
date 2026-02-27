import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

async def fix_all_passwords():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["medicine_management"]
    users = db["users"]
    
    password = "kalyani@123"
    hashed = pwd_context.hash(password)
    
    # Update ALL users to have the same working password for now to avoid 401
    result = await users.update_many({}, {"$set": {"password": hashed}})
    print(f"Updated {result.modified_count} users. All passwords are now: {password}")

if __name__ == "__main__":
    asyncio.run(fix_all_passwords())
