import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

async def create_test_user():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["medicine_management"]
    users = db["users"]
    
    email = "test@test.com"
    password = "password123"
    hashed = pwd_context.hash(password)
    
    await users.delete_many({"email": email})
    await users.insert_one({
        "name": "Test User",
        "email": email,
        "password": hashed,
        "role": "admin"
    })
    print(f"Created user {email} with password {password}")

if __name__ == "__main__":
    asyncio.run(create_test_user())
