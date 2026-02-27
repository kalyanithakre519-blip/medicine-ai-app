from fastapi import APIRouter, Depends
from typing import List, Dict
from database import medicines_collection, bills_collection
from auth import get_current_user
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
import asyncio

router = APIRouter()

# Simple Knowledge Base for Interactions (Demo Purpose)
INTERACTIONS = {
    frozenset(["Aspirin", "Warfarin"]): "Critical: Increased risk of bleeding.",
    frozenset(["Paracetamol", "Alcohol"]): "Warning: Liver damage risk.",
    frozenset(["Ibuprofen", "Aspirin"]): "Moderate: Reduces anti-clotting effect.",
    frozenset(["Amoxicillin", "Methotrexate"]): "Critical: Toxic accumulation of Methotrexate.",
}

@router.post("/check-interactions")
async def check_interactions(medicines: List[str], current_user: dict = Depends(get_current_user)):
    alerts = []
    med_set = set(medicines)
    
    # Check all pairs
    for interaction_pair, warning in INTERACTIONS.items():
        if interaction_pair.issubset(med_set):
            alerts.append(f"Interaction detected between {list(interaction_pair)}: {warning}")
            
    return {"alerts": alerts}

@router.get("/predictions")
async def get_predictions(current_user: dict = Depends(get_current_user)):
    medicines = await medicines_collection.find().to_list(1000)
    bills = await bills_collection.find().to_list(1000)
    
    # Process Bills to get daily consumption
    if not bills:
         # Fallback to simulation if no data
         return await get_simulated_predictions(medicines)

    df_bills = pd.DataFrame(bills)
    
    # Flatten bill items
    bill_items = []
    for bill in bills:
        bill_date = bill.get("created_at", datetime.now())
        for item in bill.get("items", []):
            bill_items.append({
                "date": bill_date,
                "medicine_id": str(item.get("medicine")),
                "quantity": item.get("quantity", 0)
            })
            
    df_items = pd.DataFrame(bill_items)
    df_items['date'] = pd.to_datetime(df_items['date'])
    
    predictions = []
    
    for med in medicines:
        med_id = str(med["_id"])
        stock = med.get("stock", 0)
        
        # Filter sales for this medicine
        med_sales = df_items[df_items['medicine_id'] == med_id]
        
        if med_sales.empty or len(med_sales) < 5:
            # Not enough data, use simple average or fallback
            avg_daily_sales = med_sales['quantity'].sum() / 30 if not med_sales.empty else 1
            predicted_consumption = avg_daily_sales if avg_daily_sales > 0 else 1 
        else:
            try:
                # ML: Linear Regression on Daily Sales
                daily_sales = med_sales.groupby(med_sales['date'].dt.date)['quantity'].sum().reset_index()
                # Ensure we have at least 2 distinct days for regression
                if len(daily_sales) < 2:
                    predicted_consumption = med_sales['quantity'].mean()
                else:
                    daily_sales['day_ordinal'] = pd.to_datetime(daily_sales['date']).apply(lambda x: x.toordinal())
                    X = daily_sales[['day_ordinal']].values
                    y = daily_sales['quantity'].values
                    model = LinearRegression()
                    model.fit(X, y)
                    next_day_ordinal = np.array([[datetime.now().toordinal() + 1]])
                    predicted_consumption = float(model.predict(next_day_ordinal)[0])
                    predicted_consumption = max(0.1, predicted_consumption)
            except Exception as e:
                print(f"ML Error for {med.get('name')}: {e}")
                predicted_consumption = 1
                
        days_until_stockout = int(stock / predicted_consumption) if predicted_consumption > 0 else 999
        
        recommendation = "Safe"
        confidence = "Medium"
        if days_until_stockout < 7:
            recommendation = "Urgent Reorder"
            confidence = "High" if len(med_sales) > 5 else "Low"
        elif days_until_stockout < 30:
            recommendation = "Reorder Soon"
            
        predictions.append({
            "medicineName": med.get("name"),
            "currentStock": stock,
            "predictedConsumptionRate": round(float(predicted_consumption), 2),
            "daysUntilStockout": days_until_stockout,
            "recommendation": recommendation,
            "confidence": confidence
        })
        
    return predictions

async def get_simulated_predictions(medicines):
    predictions = []
    for med in medicines:
        stock = med.get("stock", 0)
        daily_consumption = 5 
        days_until_stockout = stock // daily_consumption if daily_consumption > 0 else 999
        
        recommendation = "Safe"
        confidence = "Low (Simulated)"
        if days_until_stockout < 7:
            recommendation = "Urgent Reorder"
        elif days_until_stockout < 30:
            recommendation = "Reorder Soon"
            
        predictions.append({
            "medicineName": med.get("name"),
            "currentStock": stock,
            "predictedConsumptionRate": daily_consumption,
            "daysUntilStockout": days_until_stockout,
            "recommendation": recommendation,
            "confidence": confidence
        })
    return predictions

@router.get("/stats/sales")
async def get_sales_stats():
    bills = await bills_collection.find().to_list(1000)
    if not bills:
        return {"total_revenue": 0, "sales_trend": []}
    
    df = pd.DataFrame(bills)
    if 'created_at' in df.columns:
        df['date'] = pd.to_datetime(df['created_at'])
    else:
        df['date'] = pd.to_datetime(datetime.now())

    total_revenue = df['totalAmount'].sum() if 'totalAmount' in df.columns else 0
    total_orders = len(df)
    avg_order = df['totalAmount'].mean() if 'totalAmount' in df.columns else 0
    
    sales_by_date = df.groupby(df['date'].dt.date)['totalAmount'].sum().reset_index()
    sales_trend = sales_by_date.rename(columns={'date': 'date', 'totalAmount': 'revenue'}).to_dict(orient='records')
    
    for item in sales_trend:
        item['date'] = item['date'].strftime('%Y-%m-%d')
        
    return {
        "total_revenue": float(total_revenue),
        "total_orders": int(total_orders),
        "average_order_value": float(avg_order),
        "sales_trend": sales_trend
    }

@router.get("/stats/top-products")
async def get_top_products():
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
    
    results = await bills_collection.aggregate(pipeline).to_list(5)
    return results
