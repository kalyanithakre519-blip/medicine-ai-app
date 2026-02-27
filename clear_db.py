import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def clear_database():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["medicine_management"]
    
    collections = ["users", "medicines", "bills", "suppliers"]
    for coll_name in collections:
        result = await db[coll_name].delete_many({})
        print(f"Deleted {result.deleted_count} documents from {coll_name}")
    
    print("\nDatabase cleared successfully! Fresh start ready.")

if __name__ == "__main__":
    asyncio.run(clear_database())
