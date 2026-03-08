import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def migrate():
    print("==================================================")
    print("DATA MIGRATION: LOCAL PC to CLOUD MONGODB")
    print("==================================================")
    
    local_uri = "mongodb://127.0.0.1:27017"
    
    # User inputs cloud URI
    cloud_uri = input("\nPlease paste your COMPLETE Cloud MongoDB Link (with your password instead of <db_password>):\n> ").strip()
    
    if "<db_password>" in cloud_uri:
        print("❌ Error: Aapne <db_password> ko apne asali password se replace nahi kiya hai. Kripya wapas run karein.")
        return

    print("\nConnecting to your LOCAL database...")
    local_client = AsyncIOMotorClient(local_uri)
    local_db = local_client["medicine_management"]
    
    print("Connecting to your CLOUD database...")
    try:
        cloud_client = AsyncIOMotorClient(cloud_uri)
        cloud_db = cloud_client["medicine_management"]
        # Trigger a connection attempt
        await cloud_client.server_info()
        print("Successfully connected to Cloud Database!!")
    except Exception as e:
        print(f"Error connecting to cloud database: {e}")
        print("Kripya check karein ki password sahi hai aur 'Network Access' me 0.0.0.0/0 allowed hai.")
        return

    collections = ["users", "medicines", "bills", "suppliers", "patients"]
    
    for coll_name in collections:
        print(f"\nMoving data for '{coll_name}'...")
        local_docs = await local_db[coll_name].find({}).to_list(length=None)
        
        if local_docs:
            print(f"   - Found {len(local_docs)} records inside your laptop.")
            # Delete old data to prevent duplicate errors
            await cloud_db[coll_name].delete_many({})
            # Upload new data
            await cloud_db[coll_name].insert_many(local_docs)
            print(f"   Successfully uploaded {len(local_docs)} records to Cloud!")
        else:
            print(f"   - Collection is empty. Skipping.")

    print("\n==================================================")
    print("MIGRATION COMPLETE! EVERYTHING IS IN THE CLOUD")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(migrate())
