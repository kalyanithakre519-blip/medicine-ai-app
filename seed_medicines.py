import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import random

MONGO_URI = "mongodb://127.0.0.1:27017"
DB_NAME = "medicine_management"
USER_ID = "6997f913d3448c608cbebef7" # From logs

async def seed_data():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    medicines_collection = db["medicines"]

    medicine_list = [
        # Cardiac
        {"name": "Telma 40", "category": "Cardiac", "price": 120, "stock": 50, "manufacturer": "Glenmark"},
        {"name": "Ecosprin 75", "category": "Cardiac", "price": 15, "stock": 200, "manufacturer": "USV"},
        {"name": "Lipitor 10", "category": "Cardiac", "price": 450, "stock": 30, "manufacturer": "Pfizer"},
        {"name": "Inderal 10", "category": "Cardiac", "price": 45, "stock": 100, "manufacturer": "Abbott"},
        {"name": "Concor 5", "category": "Cardiac", "price": 110, "stock": 80, "manufacturer": "Merck"},
        # Diabetes
        {"name": "Glycomet 500", "category": "Diabetes", "price": 40, "stock": 150, "manufacturer": "USV"},
        {"name": "Galvus Met", "category": "Diabetes", "price": 320, "stock": 40, "manufacturer": "Novartis"},
        {"name": "Jardiance 10", "category": "Diabetes", "price": 850, "stock": 20, "manufacturer": "Boehringer"},
        {"name": "Glimisave M1", "category": "Diabetes", "price": 95, "stock": 120, "manufacturer": "Eris"},
        {"name": "Istamet 50/500", "category": "Diabetes", "price": 480, "stock": 30, "manufacturer": "Sun Pharma"},
        # Antibiotics
        {"name": "Augmentin 625 Duo", "category": "Antibiotics", "price": 200, "stock": 60, "manufacturer": "GSK"},
        {"name": "Mox 500", "category": "Antibiotics", "price": 80, "stock": 100, "manufacturer": "Sun Pharma"},
        {"name": "Azithral 500", "category": "Antibiotics", "price": 115, "stock": 70, "manufacturer": "Alembic"},
        {"name": "Zifi 200", "category": "Antibiotics", "price": 105, "stock": 90, "manufacturer": "FDC"},
        {"name": "Taxim O 200", "category": "Antibiotics", "price": 110, "stock": 85, "manufacturer": "Alkem"},
        # Painkillers / Fever
        {"name": "Dolo 650", "category": "Painkillers", "price": 30, "stock": 300, "manufacturer": "Micro Labs"},
        {"name": "Combiflam", "category": "Painkillers", "price": 45, "stock": 250, "manufacturer": "Sanofi"},
        {"name": "Zerodol-P", "category": "Painkillers", "price": 60, "stock": 180, "manufacturer": "Ipca"},
        {"name": "Calpol 500", "category": "Painkillers", "price": 15, "stock": 400, "manufacturer": "GSK"},
        {"name": "Crocin Advance", "category": "Painkillers", "price": 25, "stock": 350, "manufacturer": "GSK"},
        # Gastroenterology
        {"name": "Pan 40", "category": "Gastro", "price": 140, "stock": 120, "manufacturer": "Alkem"},
        {"name": "Pantocid D SR", "category": "Gastro", "price": 190, "stock": 60, "manufacturer": "Sun Pharma"},
        {"name": "Digene Gel", "category": "Gastro", "price": 120, "stock": 40, "manufacturer": "Abbott"},
        {"name": "Omee", "category": "Gastro", "price": 60, "stock": 150, "manufacturer": "Alkem"},
        {"name": "Zantac", "category": "Gastro", "price": 35, "stock": 200, "manufacturer": "GSK"},
        # Vitamins / Supplements
        {"name": "Zincovit", "category": "Supplements", "price": 105, "stock": 200, "manufacturer": "Apex"},
        {"name": "Shelcal 500", "category": "Supplements", "price": 95, "stock": 180, "manufacturer": "Torrent"},
        {"name": "Neurobion Forte", "category": "Supplements", "price": 35, "stock": 500, "manufacturer": "P&G"},
        {"name": "Becosules", "category": "Supplements", "price": 45, "stock": 400, "manufacturer": "Pfizer"},
        {"name": "Evion 400", "category": "Supplements", "price": 80, "stock": 250, "manufacturer": "Merck"},
        # Respiratory
        {"name": "Ascoril LS", "category": "Respiratory", "price": 110, "stock": 50, "manufacturer": "Glenmark"},
        {"name": "Benadryl", "category": "Respiratory", "price": 130, "stock": 45, "manufacturer": "J&J"},
        {"name": "Alex Syrup", "category": "Respiratory", "price": 125, "stock": 40, "manufacturer": "Glenmark"},
        {"name": "Allegra 120", "category": "Respiratory", "price": 180, "stock": 70, "manufacturer": "Sanofi"},
        {"name": "Montair LC", "category": "Respiratory", "price": 210, "stock": 65, "manufacturer": "Cipla"},
        # Neurological
        {"name": "Stugeron 25", "category": "Neurological", "price": 160, "stock": 30, "manufacturer": "Janssen"},
        {"name": "Vertin 16", "category": "Neurological", "price": 145, "stock": 40, "manufacturer": "Abbott"},
        {"name": "Epitol 200", "category": "Neurological", "price": 50, "stock": 80, "manufacturer": "Sun Pharma"},
        {"name": "Levipil 500", "category": "Neurological", "price": 310, "stock": 25, "manufacturer": "Sun Pharma"},
        {"name": "Donep 5", "category": "Neurological", "price": 220, "stock": 20, "manufacturer": "Alkem"}
    ]

    now = datetime.utcnow()
    
    # Enrich data
    for med in medicine_list:
        med["user"] = USER_ID
        med["created_at"] = now
        # Random expiry dates between 1 month and 2 years from now
        random_days = random.randint(30, 730)
        med["expiryDate"] = (now + timedelta(days=random_days)).strftime("%Y-%m-%d")

    # Clear existing data optionally? (USER asked to maximize, let's just add)
    await medicines_collection.insert_many(medicine_list)
    print(f"SUCCESS: Added {len(medicine_list)} high-demand medicines to the inventory.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
