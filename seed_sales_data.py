import random
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId

def seed_data():
    client = MongoClient("mongodb://127.0.0.1:27017")
    db = client["medicine_management"]
    
    # Get some real medicines to use in bills
    medicines = list(db["medicines"].find())
    if not medicines:
        print("No medicines found. Please add some medicines first.")
        return

    # Clear existing bills for a clean start (optional)
    # db["bills"].delete_many({})
    
    bills = []
    start_date = datetime.now() - timedelta(days=180) # 6 months ago
    
    print(f"Generating 200 bills starting from {start_date.date()}...")

    for i in range(200):
        # Random date between start_date and now
        random_days = random.randint(0, 180)
        bill_date = start_date + timedelta(days=random_days)
        
        # Select 1-4 random medicines
        sample_size = random.randint(1, 4)
        selected_meds = random.sample(medicines, min(sample_size, len(medicines)))
        
        items = []
        total_amount = 0
        
        for med in selected_meds:
            qty = random.randint(1, 5)
            price = med.get("price", 100)
            amount = qty * price
            items.append({
                "medicineId": med["_id"],
                "name": med["name"],
                "quantity": qty,
                "price": price,
                "amount": amount
            })
            total_amount += amount
        
        bill = {
            "customerName": f"Customer {i+1}",
            "customerPhone": f"9876543{random.randint(100, 999)}",
            "items": items,
            "totalAmount": total_amount,
            "paymentMethod": random.choice(["Cash", "Card", "UPI"]),
            "createdAt": bill_date,
            "updatedAt": bill_date
        }
        bills.append(bill)
    
    if bills:
        db["bills"].insert_many(bills)
        print(f"Successfully added {len(bills)} bills.")

if __name__ == "__main__":
    seed_data()
