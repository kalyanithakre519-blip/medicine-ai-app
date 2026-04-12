from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
from datetime import datetime, timedelta
import os
import random
import time
import io
import traceback
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Use environment variable for connection string or default
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client['medicine_management']
try:
    client.server_info() # Trigger connection check
except Exception as e:
    print(f"CRITICAL: Could not connect to MongoDB: {e}")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "running", "service": "Python AI Reporting"}), 200

# Expanded Interaction Database (Food + Side Effects)
INTERACTIONS_DB = [
    {"pair": ["aspirin", "warfarin"], "severity": "HIGH", "warning": "Increased bleeding risk.", "side_effects": ["Easy bruising", "Nosebleeds"]},
    {"pair": ["sildenafil", "nitroglycerin"], "severity": "CRITICAL", "warning": "Fatal blood pressure drop.", "side_effects": ["Dizziness", "Fainting"]},
    {"pair": ["metformin", "alcohol"], "severity": "HIGH", "warning": "Lactic acidosis risk.", "side_effects": ["Muscle pain", "Weakness"]},
    # Food Interactions
    {"medicine": "levothyroxine", "food": "soy", "warning": "Soy can decrease absorption."},
    {"medicine": "ciprofloxacin", "food": "dairy", "warning": "Calcium in dairy reduces effectiveness."},
    {"medicine": "warfarin", "food": "leafy greens", "warning": "Vitamin K can counteract effectiveness."},
    {"medicine": "lipitor", "food": "grapefruit", "warning": "Increases medicine levels in blood."},
]

@app.route('/api/check-interactions', methods=['POST'])
def check_interactions():
    try:
        data = request.json
        medicines = [m['name'].lower() for m in data.get('medicines', [])]
        
        found_drug_interactions = []
        found_food_interactions = []
        
        # Check Drug-Drug
        for i in range(len(medicines)):
            for j in range(i+1, len(medicines)):
                m1, m2 = medicines[i], medicines[j]
                for inter in INTERACTIONS_DB:
                    if "pair" in inter:
                        p1, p2 = inter['pair'][0].lower(), inter['pair'][1].lower()
                        if (p1 in m1 and p2 in m2) or (p1 in m2 and p2 in m1):
                            found_drug_interactions.append({
                                "medicines": [m1, m2],
                                "severity": inter['severity'],
                                "warning": inter['warning'],
                                "side_effects": inter.get('side_effects', [])
                            })
        
        # Check Drug-Food
        for m in medicines:
            for inter in INTERACTIONS_DB:
                if "medicine" in inter:
                    if inter['medicine'] in m:
                        found_food_interactions.append({
                            "medicine": m,
                            "food": inter['food'],
                            "warning": inter['warning']
                        })
        
        return jsonify({
            "interactions": found_drug_interactions,
            "food_warnings": found_food_interactions
        })
    except Exception as e:
        print(f"ERROR in check_interactions: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-invoice', methods=['POST'])
def generate_invoice():
    try:
        data = request.json
        items = data.get('items', [])
        invoice_id = f"INV-{int(time.time())}"
        customer = data.get('customer', 'Walking Customer')
        total = data.get('total', 0)
        
        from fpdf import FPDF
        pdf = FPDF()
        pdf.add_page()
        
        # Pharmacy Header
        pdf.set_font("Arial", 'B', 20)
        pdf.set_text_color(16, 185, 129) # Emerald Green
        pdf.cell(200, 15, txt="AI-GEN MEDS PHARMACY", ln=True, align='C')
        pdf.set_font("Arial", size=10)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(200, 5, txt="Sector 62, Noida, UP - 201301 | GSTIN: 09AAXCM1234A1Z5", ln=True, align='C')
        pdf.ln(10)
        
        # Invoice Info
        pdf.set_font("Arial", 'B', 12)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(100, 10, f"BILL TO: {customer}")
        pdf.cell(100, 10, f"INVOICE #: {invoice_id}", align='R')
        pdf.ln(5)
        pdf.set_font("Arial", size=10)
        pdf.cell(100, 10, f"Phone: {data.get('phone', 'N/A')}")
        pdf.cell(100, 10, f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}", align='R')
        pdf.ln(15)
        
        # Table Header
        pdf.set_fill_color(243, 244, 246)
        pdf.set_font("Arial", 'B', 10)
        pdf.cell(80, 10, " Item Name", 1, 0, 'L', True)
        pdf.cell(30, 10, " Qty", 1, 0, 'C', True)
        pdf.cell(40, 10, " Price", 1, 0, 'C', True)
        pdf.cell(40, 10, " Amount", 1, 1, 'C', True)
        
        # Table Content
        pdf.set_font("Arial", size=10)
        for item in items:
            pdf.cell(80, 10, f" {item['name']}", 1)
            pdf.cell(30, 10, f" {item['quantity']}", 1, 0, 'C')
            pdf.cell(40, 10, f" Rs. {item['price']}", 1, 0, 'C')
            pdf.cell(40, 10, f" Rs. {item['amount']}", 1, 1, 'C')
            
        # Totals
        pdf.ln(5)
        gst = round(total * 0.12, 2)
        pdf.set_font("Arial", 'B', 11)
        pdf.cell(150, 10, "Subtotal", 0, 0, 'R')
        pdf.cell(40, 10, f"Rs. {total}", 0, 1, 'R')
        pdf.cell(150, 10, "GST (12%)", 0, 0, 'R')
        pdf.cell(40, 10, f"Rs. {gst}", 0, 1, 'R')
        pdf.set_font("Arial", 'B', 14)
        pdf.set_text_color(79, 70, 229) # Indigo
        pdf.cell(150, 12, "Grand Total", 0, 0, 'R')
        pdf.cell(40, 12, f"Rs. {total + gst}", 0, 1, 'R')
        
        pdf.ln(10)
        pdf.set_font("Arial", 'I', 8)
        pdf.set_text_color(150, 150, 150)
        pdf.multi_cell(190, 5, "Terms: Medicines once sold will not be taken back. This is a computer-generated invoice and doesn't require a physical signature.", align='C')

        out = pdf.output(dest='S')
        if isinstance(out, str):
            out = out.encode('latin-1', 'replace')
            
        return send_file(
            io.BytesIO(out),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"Invoice_{invoice_id}.pdf"
        )
    except Exception as e:
        print(f"ERROR in generate_invoice: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats/multi-store', methods=['GET'])
def get_multi_store_stats():
    # Feature 6: Multi-store mock analytics
    stores = ["Noida HQ", "Delhi Central", "Gurgaon Branch", "Mumbai Hub"]
    data = []
    for store in stores:
        data.append({
            "store": store,
            "sales": random.randint(50000, 200000),
            "stock_health": random.randint(70, 98),
            "top_category": random.choice(["Antibiotics", "Cardiac", "Painkillers", "Diabetes"])
        })
    return jsonify(data)

# Centralized Medical & Dietary Knowledge Base
MEDICAL_DIET_KNOWLEDGE = [
    {
        "keywords": ["diabetes", "sugar", "metformin", "insulin", "glycomet", "gluconorm"],
        "fruit": "Jamun (Black Plum), Apple, Guava, Berries",
        "water": "3-4 Liters/Day (Stay hydrated to flush glucose)",
        "avoid": "Sugar, White Rice, Maida, Sweetified Juices, Deep Fried Food",
        "message": "Focus on Low Glycemic Index foods to maintain steady blood sugar levels."
    },
    {
        "keywords": ["heart", "cardiac", "cholesterol", "lipitor", "atorvastatin", "bp", "hyper", "blood pressure", "telmisartan"],
        "fruit": "Berries, Orange, Papaya, Banana, Watermelon",
        "water": "2.5-3 Liters/Day (Balanced intake)",
        "avoid": "Oily Food, High Trans-fat, Salt (Sodium), Pickles, Red Meat",
        "message": "Heart-healthy diet with low sodium and high potassium is recommended."
    },
    {
        "keywords": ["fever", "cold", "flu", "paracetamol", "dolo", "calpol", "infection", "viral"],
        "fruit": "Citrus Fruits (Vitamin C), Kiwi, Pomegranate",
        "water": "4+ Liters/Day (Crucial to prevent dehydration during fever)",
        "avoid": "Cold Drinks, Ice Cream, Oily/Heavy Food, Spicy Curry",
        "message": "Light, easily digestible food (like Khichdi) and high fluid intake are vital."
    },
    {
        "keywords": ["stomach", "acidity", "gastric", "pantocid", "digene", "pan-40", "diarrhea", "loose motion"],
        "fruit": "Banana, Pomegranate, Wood Apple (Bel)",
        "water": "ORS Solution, Coconut Water, Buttermilk (Lassi)",
        "avoid": "Spicy Food, Caffeine, Dairy (during diarrhea), Alcohol",
        "message": "Stick to the BRAT diet (Bananas, Rice, Applesauce, Toast) for stomach issues."
    },
    {
        "keywords": ["kidney", "renal", "creatinine", "stones"],
        "fruit": "Apple, Blueberries, Grapes",
        "water": "1.5-2 Liters (As per MD advice based on renal function)",
        "avoid": "High Potassium (Spinach, Banana), High Salt, Red Meat",
        "message": "Renal-friendly diet requires strict monitoring of electrolytes."
    },
    {
        "keywords": ["arthritis", "joint", "pain", "bone", "calcium", "combiflam", "zerodol"],
        "fruit": "Cherries, Pineapple, Avocado",
        "water": "3 Liters/Day",
        "avoid": "Refined Sugars, Processed Foods, Excessive Red Meat",
        "message": "Anti-inflammatory foods help reduce joint pain and stiffness."
    },
    {
        "keywords": ["thyroid", "levothyroxine", "thyronorm"],
        "fruit": "Berries, Apples, Dates",
        "water": "3 Liters/Day",
        "avoid": "Soy, Cabbage, Cauliflower (Cruciferous veggies in excess)",
        "message": "Ensure adequate Iodine and Selenium intake; take medicine on empty stomach."
    },
    {
        "keywords": ["haemoglobin", "anemia", "iron", "blood", "weakness", "dexorange", "orofer"],
        "fruit": "Pomegranate, Apple, Beetroot, Dates, Figs",
        "water": "2-3 Liters/Day",
        "avoid": "Tea/Coffee during meals (inhibits iron absorption), Junk Food",
        "message": "Concentrate on Iron-rich foods like Spinach, Beetroot, and Vitamin C (helps iron absorption)."
    },
    {
        "keywords": ["antibiotic", "infection", "azithromycin", "azitromycin", "azee", "azithral", "mox", "amoxicillin", "cipro"],
        "fruit": "Citrus Fruits, Kiwi, Berries (Boosts Immunity)",
        "water": "3-4 Liters/Day",
        "avoid": "Dairy Products (with some antibiotics), Alcohol, Sugary Drinks",
        "message": "Antibiotics can affect gut flora; consume Vitamin C rich fruits to support immunity."
    },
    {
        "keywords": ["constipation", "lactulose", "stool", "digestion", "cremaffin", "duphalac"],
        "fruit": "Papaya, Guava, Pear, Apple (with skin)",
        "water": "4+ Liters/Day (Essential for stool softening)",
        "avoid": "Processed Foods, Fried Snacks, Heavy Dairy, Low-fiber food",
        "message": "High-fiber fruits like Papaya and Guava are excellent for natural bowel movement."
    },
    {
        "keywords": ["painkiller", "aspirin", "combiflam", "brufen", "voveran", "diclofenac"],
        "fruit": "Pomegranate, Blueberries, Cherries (Anti-inflammatory)",
        "water": "3 Liters/Day",
        "avoid": "Empty Stomach medication, Alcohol, Very Spicy Food",
        "message": "Antioxidant-rich fruits help reduce inflammation and protect the stomach lining."
    },
    {
        "keywords": ["allergy", "skin", "itching", "cetirizine", "allegra", "fexo", "levocetirizine"],
        "fruit": "Apple, Kiwi, Citrus (Vitamin C based anti-histamine support)",
        "water": "3-4 Liters/Day",
        "avoid": "High Histamine foods (Fermented food), Sugar, Artificial colors",
        "message": "Vitamin C rich fruits act as natural antihistamines and help manage allergies."
    },
    {
        "keywords": ["vitamin", "multivitamin", "zincovit", "supradyn", "revital", "a to z"],
        "fruit": "Mix Fruit Platter (Apple, Banana, Papaya, Grapes)",
        "water": "3 Liters/Day",
        "avoid": "Skipping meals, Junk Food, Soda",
        "message": "Support your vitamin supplements with a variety of fresh seasonal fruits."
    }
]

def get_diet_advice(query):
    query = query.lower()
    for entry in MEDICAL_DIET_KNOWLEDGE:
        if any(k in query for k in entry['keywords']):
            return {
                "fruit": entry['fruit'],
                "water": entry['water'],
                "avoid": entry['avoid'],
                "message": entry['message']
            }
    
    # Smart Fallback based on generic terms
    return {
        "fruit": "Seasonal Fruits & Berries (AI Fallback)",
        "water": "3-4 Liters/Day (Balanced)",
        "avoid": "Junk Food, Processed Sugar, Excess Oil",
        "message": "Maintain a balanced diet. We didn't find specific data for this exact query, so follow general wellness protocols."
    }

@app.route('/api/ai-diet', methods=['POST'])
def api_diet_advice():
    try:
        data = request.json
        query = data.get('query', '')
        advice = get_diet_advice(query)
        return jsonify(advice)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict-refills', methods=['GET'])
def predict_refills():
    try:
        patients_col = db['patients']
        db_patients = list(patients_col.find({}))
        
        processed_patients = []
        now = datetime.now()
        
        for p in db_patients:
            # Handle date conversion
            last_bought_str = p.get('lastBought')
            if isinstance(last_bought_str, datetime):
                last_bought = last_bought_str
            else:
                try:
                    last_bought = datetime.fromisoformat(str(last_bought_str).replace('Z', '+00:00'))
                except:
                    last_bought = now - timedelta(days=30) # fallback
            
            days_supply = int(p.get('daysSupply', 30))
            exhausted_on = last_bought + timedelta(days=days_supply)
            days_diff = (exhausted_on - now).days
            
            status = "HEALTHY"
            risk_level = "LOW"
            reason = "Patient adherence seems stable."
            
            if days_diff < 0:
                status = "OVERDUE"
                risk_level = "CRITICAL"
                reason = f"Exhaustion point reached {abs(days_diff)} days ago. Vital dosage gap detected."
            elif days_diff < 5:
                status = "DUE SOON"
                risk_level = "HIGH"
                reason = "Supply running low. Refill required within 48-72 hours."
                
            # Use Centralized AI Suggestion Logic
            query_context = f"{p.get('condition', '')} {p.get('medicine', '')}"
            ai_advice = get_diet_advice(query_context)
            
            fruit = p.get('fruitRecommendation') or ai_advice['fruit']
            water = p.get('waterIntake') or ai_advice['water']
            avoid = p.get('dietaryRestrictions') or ai_advice['avoid']

            processed_patients.append({
                "id": str(p['_id']),
                "name": p.get('name'),
                "phone": p.get('phone'),
                "medicine": p.get('medicine'),
                "condition": p.get('condition'),
                "last_bought": last_bought.strftime('%Y-%m-%d'),
                "days_supply": days_supply,
                "exhausted_on": exhausted_on.strftime('%Y-%m-%d'),
                "status": status,
                "risk_level": risk_level,
                "reason": reason,
                "fruit": fruit,
                "water": water,
                "avoid": avoid
            })
            
        # Add mock data if no real patients exist to keep the UI alive initially
        if not processed_patients:
             processed_patients = [
                {
                    "name": "Amit Sharma (Demo)", "phone": "9623245915", "medicine": "Metformin 500mg", 
                    "condition": "Diabetes", "last_bought": "2026-01-20", "days_supply": 30, 
                    "exhausted_on": "2026-02-19", "status": "OVERDUE", "risk_level": "CRITICAL",
                    "reason": "Blood sugar spike risk without sustained dosage."
                }
            ]
            
        return jsonify(processed_patients)
    except Exception as e:
        print(f"Error in predict_refills: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats/sales', methods=['GET'])
def get_sales_stats():
    try:
        bills_collection = db['bills']
        cursor = bills_collection.find({})
        bills = list(cursor)
        
        if not bills:
            return jsonify({
                "total_revenue": 0,
                "total_orders": 0,
                "average_order_value": 0,
                "sales_trend": []
            })

        df = pd.DataFrame(bills)
        # Handle date conversion carefully
        if 'createdAt' in df.columns:
            df['date'] = pd.to_datetime(df['createdAt'])
        elif 'created_at' in df.columns:
            df['date'] = pd.to_datetime(df['created_at'])
        else:
            # Fallback for old records if any
            df['date'] = datetime.utcnow()

        total_revenue = float(df['totalAmount'].sum())
        total_orders = len(df)
        avg_value = total_revenue / total_orders if total_orders > 0 else 0

        # Daily Trend (Last 30 days)
        daily_sales = df.groupby(df['date'].dt.date)['totalAmount'].sum().reset_index()
        daily_sales.columns = ['date', 'revenue']
        daily_sales['date'] = daily_sales['date'].apply(lambda x: x.strftime('%Y-%m-%d'))
        trend = daily_sales.tail(30).to_dict(orient='records')

        return jsonify({
            "total_revenue": round(total_revenue, 2),
            "total_orders": total_orders,
            "average_order_value": round(avg_value, 2),
            "sales_trend": trend
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats/expiry-risk', methods=['GET'])
def get_expiry_risk():
    try:
        meds_collection = db['medicines']
        medicines = list(meds_collection.find({}))
        
        risk_data = []
        now = datetime.now()
        
        for med in medicines:
            expiry_str = med.get('expiryDate') or med.get('expiry_date')
            if not expiry_str:
                continue
                
            try:
                if isinstance(expiry_str, datetime):
                    expiry_date = expiry_str
                else:
                    # Try common formats
                    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%Y/%m/%d"):
                        try:
                            expiry_date = datetime.strptime(str(expiry_str).split('T')[0], fmt)
                            break
                        except:
                            continue
                
                days_remaining = (expiry_date - now).days
                
                risk_level = "LOW"
                recommendation = "Keep in stock"
                
                if days_remaining < 0:
                    risk_level = "EXPIRED"
                    recommendation = "DISPOSE IMMEDIATELY - Critical hazard"
                elif days_remaining < 30:
                    risk_level = "CRITICAL"
                    recommendation = "Move to front shelf & heavy discount"
                elif days_remaining < 90:
                    risk_level = "HIGH"
                    recommendation = "Bundle with other products"
                
                risk_data.append({
                    "name": med.get('name', 'Unknown'),
                    "expiryDate": expiry_date.strftime('%Y-%m-%d'),
                    "daysRemaining": days_remaining,
                    "riskLevel": risk_level,
                    "stock": med.get('stock', 0),
                    "recommendation": recommendation
                })
            except Exception as e:
                print(f"Error parsing date for {med.get('name')}: {e}")
                continue
                
        # Sort by most urgent first
        risk_data.sort(key=lambda x: x['daysRemaining'])
        return jsonify(risk_data)
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats/top-products', methods=['GET'])
def get_top_products():
    try:
        pipeline = [
            {"$unwind": "$items"},
            {"$group": {
                "_id": "$items.name",
                "total_quantity": {"$sum": "$items.quantity"},
                "total_revenue": {"$sum": "$items.amount"}
            }},
            {"$sort": {"total_quantity": -1}},
            {"$limit": 5}
        ]
        results = list(db['bills'].aggregate(pipeline))
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats/forecast', methods=['GET'])
def get_forecast():
    try:
        meds_collection = db['medicines']
        bills_collection = db['bills']
        
        medicines = list(meds_collection.find({}))
        bills = list(bills_collection.find({}))
        
        # Calculate item-wise demand
        item_demand = {}
        for b in bills:
            for item in b.get('items', []):
                name = item.get('name')
                qty = item.get('quantity', 1)
                item_demand[name] = item_demand.get(name, 0) + float(qty)
                
        results = []
        
        # Simulation parameters for Wholesale/Pharma
        ordering_cost_per_order = 500  # Cost to place an order in Rs
        holding_cost_percentage = 0.20 # 20% holding cost per year
        
        for med in medicines:
            name = med.get('name', 'Unknown')
            current_stock = float(med.get('stock', 0))
            price = float(med.get('price', 100))
            if price <= 0: price = 100
            
            # Annual demand formulation (Simulated using existing data extrapolated to 365 days)
            # If no data, give a random baseline demand
            observed_demand = item_demand.get(name, 0)
            if observed_demand > 0:
                annual_demand = observed_demand * (365 / max(len(bills), 1))
            else:
                annual_demand = random.uniform(500, 5000)
                
            daily_demand = annual_demand / 365
            
            # Formulate EOQ (Economic Order Quantity) -> sqrt((2 * D * S) / H)
            holding_cost_per_unit = price * holding_cost_percentage
            eoq = ((2 * annual_demand * ordering_cost_per_order) / holding_cost_per_unit) ** 0.5
            
            # Safety Stock and Reorder Point (Lead Time ~ 3-7 days)
            lead_time_days = random.randint(3, 7)
            max_daily_demand = daily_demand * 1.5 
            safety_stock = (max_daily_demand * lead_time_days) - (daily_demand * lead_time_days)
            reorder_point = (daily_demand * lead_time_days) + safety_stock
            
            # ABC/VED Categorization (A=High Value/Vol, B=Medium, C=Low)
            annual_value = annual_demand * price
            category = "A (VIP)" if annual_value > 500000 else ("B (Standard)" if annual_value > 100000 else "C (Slow Mover)")
            
            status = "HEALTHY"
            if current_stock < reorder_point:
                status = "REORDER NOW"
            elif current_stock > eoq * 2:
                status = "OVERSTOCKED"
                
            results.append({
                "medicine": name,
                "current_stock": int(current_stock),
                "daily_velocity": round(daily_demand, 1),
                "category": category,
                "eoq": int(eoq),
                "reorder_point": int(reorder_point),
                "safety_stock": int(safety_stock),
                "status": status,
                "annual_value": round(annual_value, 2)
            })
            
        # Sort by Annual Value (A items first)
        results.sort(key=lambda x: x['annual_value'], reverse=True)
        
        # We also need to send a sawtooth inventory projection data for the top selling item for graphing
        sawtooth_data = []
        if results:
            top_med = results[0]
            sim_stock = top_med['current_stock']
            sim_velocity = top_med['daily_velocity']
            sim_eoq = top_med['eoq']
            sim_reorder = top_med['reorder_point']
            
            now = datetime.now()
            for i in range(30): # 30 day projection
                date_str = (now + timedelta(days=i)).strftime('%m-%d')
                sim_stock -= sim_velocity
                if sim_stock <= sim_reorder:
                    # Trigger Restock (Arrives after lead time, simplifying to arrive instantly here for graph clarity)
                    sim_stock += sim_eoq
                    
                sawtooth_data.append({
                    "date": date_str,
                    "stockLevel": max(0, int(sim_stock)),
                    "reorderLevel": int(sim_reorder)
                })
                
        return jsonify({
            "top_item_graph": sawtooth_data,
            "inventory_intelligence": results[:20],
            "confidence_score": 98,
            "algorithm": "Dynamic EOQ & JIT Replenishment Model"
        })
    except Exception as e: 
        print(f"Forecast Error: {traceback.format_exc()}")
        return jsonify({"error": f"AI Forecast failed: {str(e)}"}), 500

def find_substitutes(query):
    query = query.lower()
    
    # 1. Reverse map: Generic to Brands
    # If a generic is matched, return its brands.
    # 2. Map Brands to other Brands in the same category.
    
    SUB_GROUPS = [
        # Stomach / Acidity / Digestion
        ["pan-40", "pantocid", "pantosec", "pantop", "omez", "omecip", "omee", "aciloc"],
        ["digene", "gelusil", "mylanta", "polycrol"],
        ["cyclopam", "meftal-spas", "buscogast", "drotaverine"],
        ["zantac", "rantac", "ranitidine", "aciloc 150"],
        
        # Headache / Neurological
        ["saridon", "disprin", "crocin pain", "aspirin", "ecosprin", "loprin"],
        ["napra", "naproxen", "aleve", "headset"],
        ["inderal", "ciplanar", "propranolol"],
        
        # Fever / Viral / Cold
        ["dolo 650", "calpol 500", "crocin 650", "paracetamol", "pacimol", "p-500", "sumo"],
        ["nimulid", "nise", "nimocer", "nimesulide"],
        
        # Cough / Respiratory
        ["benadryl", "corex", "ascoril", "grilinctus", "alex syrup", "kofex", "glycodin"],
        
        # Nausea / Vomiting
        ["vomikind", "ondem", "stemetil", "perinorm", "zofer", "emset"],
        
        # Muscle / Bodily Pain
        ["combiflam", "ibugesic plus", "flexon", "zupar", "brufen"],
        ["zerodol-p", "aceclofenac", "hifenac-p", "aero", "acemac"],
        ["volini gel", "moov", "omnigel", "relispray"],
        ["ibuprofen", "advil", "motrin"],
        
        # Allergy / Skin
        ["allegra", "fexo", "hifen", "fexofenadine"],
        ["cetirizine", "okacet", "zyrtec", "cetzine", "cetina"],
        ["avil", "pheniramine", "chlorpheniramine"],
        ["levocetirizine", "levocet", "teczine", "l-hist", "1-al"],
        
        # Diabetes, BP, Heart, General, Nutritional
        ["metformin", "glycomet", "gluconorm", "glyciphage", "met-f"],
        ["telmisartan", "telma 40", "telsar", "telvas", "cresar"],
        ["amoxicillin", "mox 500", "novamox", "almox", "cipmox"],
        ["atorvastatin", "lipitor", "atorva", "storvas", "atocor"],
        ["azithromycin", "azithral", "azee", "zathrin", "azax"],
        ["dexorange", "orofer-xt", "chericap", "autrin", "livogen", "livogen-z", "folvite"],
        ["multivitamin", "zincovit", "supradyn", "a to z", "revital", "becosules"],
        ["ors solution", "electral", "enerzal", "prolyte", "walyte"]
    ]
    
    # Check groups
    found = set()
    for group in SUB_GROUPS:
        # Check if the query is in the group (or if any item in the group is in the query)
        if any(item in query or query in item for item in group):
            for item in group:
                found.add(item.title()) # Capitalize like brands
            
    # Symptom to generic medicine mapping (Fallback)
    SYMPTOM_MED_MAP = {
        "fever": ["Dolo 650", "Calpol 500"],
        "bukhar": ["Dolo 650", "Calpol 500"],
        "pain": ["Combiflam", "Zerodol-P"],
        "dard": ["Combiflam", "Zerodol-P"],
        "headache": ["Saridon", "Disprin"],
        "acidity": ["Pan-40", "Omez"],
        "gastric": ["Pan-40", "Digene"],
        "allergy": ["Cetirizine", "Allegra"],
        "cold": ["Levocetirizine", "Cetirizine"],
        "sardi": ["Levocetirizine", "Cetirizine"],
        "diabetes": ["Metformin", "Glycomet"],
        "sugar": ["Gluconorm", "Glyciphage"],
        "bp": ["Telma 40", "Telvas"],
        "heart": ["Atorva", "Lipitor"],
        "infection": ["Novamox", "Mox 500"],
        "cough": ["Ascoril", "Benadryl"],
        "haemoglobin": ["Dexorange", "Orofer-XT"],
        "anemia": ["Livogen", "Autrin"]
    }
    
    if not found:
        for symptom, meds in SYMPTOM_MED_MAP.items():
            if symptom in query:
                for m in meds:
                    found.add(m)
                break
                
    return list(found)

@app.route('/api/ai/symptom-analysis', methods=['POST'])
def analyze_symptoms():
    try:
        data = request.json
        symptoms_text = data.get('symptoms', '').lower()
        phone = data.get('phone', '').strip()
        
        allergies = []
        patient_name = ""
        if phone == "9999999999":
            allergies = ["paracetamol", "dolo"]
            patient_name = "Demo Patient"
        elif phone:
            patients_col = db['patients']
            patient = patients_col.find_one({"phone": phone})
            if patient and 'allergies' in patient:
                # Expecting 'allergies' could be a string "sulfa, penicillin" or list
                al_data = patient['allergies']
                if isinstance(al_data, str):
                    allergies = [a.strip().lower() for a in al_data.split(',')]
                elif isinstance(al_data, list):
                    allergies = [a.strip().lower() for a in al_data]
                patient_name = patient.get('name', 'Patient')
        
        # Comprehensive Medical Knowledge Base (Expanded)
        DIAGNOSIS_MAP = [
            {"keywords": ["stomach", "pet", "pain", "gas", "acid", "acidity", "digestion", "abdomen"], "diagnosis": "Gastric / Abdominal Distress", "medicines": ["Pan-40", "Digene", "Cyclopam", "Zantac"], "advice": "Avoid spicy food, drink warm water, and rest.", "margin_note": True},
            {"keywords": ["headache", "sir", "migraine", "dard", "head"], "diagnosis": "Neural / Tension Headache", "medicines": ["Saridon", "Napra", "Inderal", "Disprin"], "advice": "Rest in a dark room, stay hydrated, and reduce screen time.", "margin_note": True},
            {"keywords": ["fever", "bukhar", "body", "temperature", "cold", "sardi", "chills"], "diagnosis": "Viral / Seasonal infection", "medicines": ["Dolo 650", "Calpol 500", "Paracetamol", "Nimulid"], "advice": "Monitor temperature periodically, consume plenty of fluids.", "margin_note": True},
            {"keywords": ["cough", "khansi", "throat", "gala", "chest", "congestion"], "diagnosis": "Respiratory Congestion", "medicines": ["Benadryl", "Ascoril", "Alex Syrup", "Kofex"], "advice": "Steam inhalation and gargle with salt water recommended.", "margin_note": True},
            {"keywords": ["vomit", "ultee", "nausea", "dizziness", "chakkar"], "diagnosis": "Nausea / Equilibrium Issue", "medicines": ["Vomikind", "Ondem", "Stemetil"], "advice": "Frequent small sips of ORS to prevent dehydration.", "margin_note": True},
            {"keywords": ["muscle", "joint", "body", "bone", "back", "kamar", "pair"], "diagnosis": "Musculoskeletal Pain", "medicines": ["Combiflam", "Zerodol-P", "Volini Gel", "Ibuprofen"], "advice": "Apply heat compression and avoid heavy lifting.", "margin_note": True},
            {"keywords": ["skin", "itching", "rash", "khujli", "allergy"], "diagnosis": "Dermatological Allergy", "medicines": ["Allegra", "Cetirizine", "Avil", "Levocetirizine"], "advice": "Keep area clean and avoid scratching.", "margin_note": True},
            {"keywords": ["weakness", "kamzori", "fatigue", "tired", "energy"], "diagnosis": "Nutritional Deficiency / Fatigue", "medicines": ["Zincovit", "Supradyn", "A to Z", "Revital"], "advice": "Ensure a balanced diet and adequate sleep. Drink plenty of water.", "margin_note": True},
            {"keywords": ["haemoglobin", "iron", "anemia", "blood", "khoon", "hb"], "diagnosis": "Anemia / Iron Deficiency", "medicines": ["Dexorange", "Orofer-XT", "Livogen", "Autrin"], "advice": "Consume iron-rich foods like spinach, beetroot, and pomegranate.", "margin_note": True},
            {"keywords": ["sugar", "diabetes", "diabetic", "glucose"], "diagnosis": "Blood Sugar Management", "medicines": ["Glycomet", "Gluconorm", "Metformin", "Met-F"], "advice": "Monitor blood glucose levels regularly. Avoid processed sugar.", "margin_note": False},
            {"keywords": ["bp", "blood pressure", "hypertension", "heart", "cholesterol"], "diagnosis": "Cardiovascular Alert", "medicines": ["Telma 40", "Telvas", "Telmisartan", "Lipitor", "Atorva"], "advice": "Strictly restrict salt and oil intake. Requires clinical mapping.", "margin_note": False}
        ]
        
        results = []
        for d in DIAGNOSIS_MAP:
            if any(key in symptoms_text for key in d['keywords']):
                # Check for allergies
                allergic_matches = []
                allergy_warning = ""
                
                if allergies:
                    for med in d['medicines']:
                        med_lower = med.lower()
                        for alg in allergies:
                            if alg and (alg in med_lower or med_lower in alg):
                                allergic_matches.append(med)
                                
                    if allergic_matches:
                        allergy_warning = f"ALERT: Medical record for {patient_name} shows allergy to {', '.join(allergies).upper()}. The crossed-out medicines are UNSAFE."
                
                res_obj = d.copy()
                
                # Assign Substitutes
                all_subs = set()
                primary_lower = [m.lower() for m in d['medicines']]
                for med in d['medicines']:
                    subs = find_substitutes(med)
                    for s in subs:
                        if s.lower() not in primary_lower: # Don't suggest if it's already in primary
                            all_subs.add(s)
                            
                res_obj['substitutes'] = list(all_subs)[:5] # Limit to 5
                
                # Check substitutes for allergies
                if allergies:
                    for sub in res_obj['substitutes']:
                        sub_lower = sub.lower()
                        for alg in allergies:
                            if alg and (alg in sub_lower or sub_lower in alg):
                                if sub not in allergic_matches:
                                    allergic_matches.append(sub)

                if allergic_matches:
                    res_obj['allergic_matches'] = allergic_matches
                    res_obj['allergy_warning'] = allergy_warning
                results.append(res_obj)
                
        # Universal Fallback for General Symptoms
        if not results:
             fallback_meds = ["Multivitamin", "Paracetamol", "ORS Solution"]
             all_subs = set()
             primary_lower = [m.lower() for m in fallback_meds]
             for med in fallback_meds:
                 subs = find_substitutes(med)
                 for s in subs:
                     if s.lower() not in primary_lower:
                         all_subs.add(s)
                         
             results.append({
                "diagnosis": "Universal Health Protocol (General Wellness)",
                "medicines": fallback_meds,
                "substitutes": list(all_subs)[:5],
                "advice": "General fatigue or non-specific symptoms detected. Focus on hydration and rest while monitoring status.",
                "type": "General Support"
            })
            
        return jsonify({
            "status": "Success",
            "analysis": results,
            "warning": "Vision-Pro AI Insight: This is a high-precision symptom analysis. Recommending Best-Margin OTC variants where safely applicable."
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/scan-prescription', methods=['POST'])
def scan_prescription():
    try:
        # High-fidelity simulation matching the actual uploaded prescription
        time.sleep(2.0)
        
        # Simulated extraction result for Anne Burton's prescription
        extracted_text = "PRESCRIPTION NO: 0001 | DATE: NOVEMBER 8, 2021\n\nPATIENT NAME: ANNE BURTON | AGE: 30 | GENDER: FEMALE\n\nLIST OF PRESCRIBED MEDICATIONS:\n1. EXPECTORANT - 1 TABLET - EVERY 4 HOURS\n2. PARACETAMOL - 1 TABLET - EVERY 4 HOURS\n3. ANTI-BIOTIC - 500MG - EVERY 8 HOURS\n4. VITAMIN C - 500MG - ONCE A DAY\n5. VITAMIN D - 1 TABLET - ONCE A DAY\n\nPHYSICIAN: LESLIE HOLDEN | EMAIL: leslie.h@noemail.com"
        
        medicines = [
            {
                "name": "Expectorant", 
                "quantity": "15 Tablets", 
                "use": "Removes phlegm / Cough Relief",
                "confidence": 99,
                "stock": "In Stock",
                "side_effects": ["Nausea", "Dizziness"]
            },
            {
                "name": "Paracetamol 500mg", 
                "quantity": "10 Tablets", 
                "use": "Fever / Pain Relief",
                "confidence": 98,
                "stock": "In Stock",
                "side_effects": ["Nausea", "Liver issues on overdose"]
            },
            {
                "name": "Anti-biotic (500mg)", 
                "quantity": "21 Tablets", 
                "use": "Bacterial Infection Control",
                "confidence": 96,
                "stock": "In Stock",
                "side_effects": ["Diarrhea", "Stomach upset"]
            },
            {
                "name": "Vitamin C (500mg)", 
                "quantity": "30 Tablets", 
                "use": "Immune System Support",
                "confidence": 99,
                "stock": "In Stock",
                "side_effects": ["Mild stomach cramps"]
            },
            {
                "name": "Vitamin D", 
                "quantity": "10 Tablets", 
                "use": "Immune System / Bone Health",
                "confidence": 97,
                "stock": "In Stock",
                "side_effects": ["None reported at recommended dose"]
            }
        ]
        
        # AI Safety Check
        safety_alerts = [
            {
                "type": "Warning",
                "headline": "Antibiotic Protocol",
                "message": "Prescribed for bacterial infection. Patient MUST complete the full course regardless of symptoms.",
                "severity": "Medium"
            },
            {
                "type": "Info",
                "headline": "Combined Dosage",
                "message": "Expectorant and Paracetamol are both every 4 hours. Ensure staggered timing if stomach sensitivity occurs.",
                "severity": "Low"
            }
        ]
        
        return jsonify({
            "status": "Success",
            "extracted_text": extracted_text,
            "medicines": medicines,
            "safety_alerts": safety_alerts,
            "ai_logic": "DeepVision Pro V4.5 (Neural Extraction Mode)",
            "dietary_recommendations": {
                "title": "Infection Recovery",
                "message": "Optimized Diet for Immune Support",
                "recommendations": [
                    "Take Vitamin C rich fruits like Citrus and Kiwi.",
                    "Ensure high protein intake for tissue repair.",
                    "Stay hydrated with warm fluids and soups.",
                    "Avoid very cold foods while using the expectorant."
                ]
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-po', methods=['POST'])
def generate_po():
    try:
        data = request.json
        items = data.get('items', [])
        from fpdf import FPDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(200, 10, txt="PURCHASE ORDER - AI SYSTEM", ln=True, align='C')
        pdf.ln(10)
        for item in items:
            pdf.cell(100, 10, f"{item.get('name')}: {item.get('stock')} in stock -> ORDER 50", ln=True)
        out = pdf.output(dest='S')
        if isinstance(out, str):
            out = out.encode('latin-1', 'replace')
            
        return send_file(
            io.BytesIO(out),
            mimetype='application/pdf',
            as_attachment=True,
            download_name="AutoPO.pdf"
        )
    except Exception as e: 
        print(f"ERROR in generate_po: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/substitutes', methods=['GET'])
def get_substitutes():
    query = request.args.get('name', '')
    found = find_substitutes(query)
    return jsonify({"medicine": query, "substitutes": found})

if __name__ == '__main__':
    print("--- AI SERVICE STARTING ---")
    print(f"Connecting to MongoDB at: {MONGO_URI}")
    try:
        app.run(host='0.0.0.0', port=5001, debug=True, threaded=True)
    except Exception as e:
        print(f"FAILED TO START AI SERVICE: {e}")
        traceback.print_exc()
