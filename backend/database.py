from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

import re
MONGO_URI = re.sub(r'[\x00-\x20\x7F-\x9F]', '', os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017"))
DB_NAME = "medicine_management"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

users_collection = db["users"]
medicines_collection = db["medicines"]
bills_collection = db["bills"]
suppliers_collection = db["suppliers"]
patients_collection = db["patients"]

