
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_db():
    client = AsyncIOMotorClient("mongodb://127.0.0.1:27017")
    db = client["medicine_management"]
    med = await db["medicines"].find_one()
    if med:
        for k, v in med.items():
            print(f"Field: {k}, Type: {type(v)}, Value: {v}")

if __name__ == "__main__":
    asyncio.run(check_db())
