
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json

async def check_bills():
    client = AsyncIOMotorClient("mongodb://127.0.0.1:27017")
    db = client["medicine_management"]
    bills = await db["bills"].find().sort("created_at", -1).to_list(10)
    print(f"Total bills found: {len(bills)}")
    for b in bills:
        b['_id'] = str(b['_id'])
        if 'created_at' in b:
            b['created_at'] = str(b['created_at'])
        print(json.dumps(b, indent=2))

if __name__ == "__main__":
    asyncio.run(check_bills())
