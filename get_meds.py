from pymongo import MongoClient
import json

client = MongoClient("mongodb://127.0.0.1:27017")
db = client["medicine_management"]
medicines = list(db["medicines"].find({}, {"name": 1, "_id": 1, "price": 1}))

print(json.dumps([{"id": str(m["_id"]), "name": m["name"], "price": m.get("price", 0)} for m in medicines], indent=2))
