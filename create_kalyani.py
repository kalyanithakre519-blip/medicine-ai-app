import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

async def create_kalyani_user():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["medicine_management"]
    users = db["users"]
    
    email = "kalyanithakre519@gmail.com"
    password = "kalyani@123"
    hashed = pwd_context.hash(password)
    
    # Delete if exists to ensure data is fresh and password matches
    await users.delete_many({"email": email})
    
    await users.insert_one({
        "name": "Kalyani Thakre",
        "email": email,
        "password": hashed,
        "role": "admin"
    })
    print(f"User {email} created successfully with specified password.")

if __name__ == "__main__":
    asyncio.run(create_kalyani_user())
