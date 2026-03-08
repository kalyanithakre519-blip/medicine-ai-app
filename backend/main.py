from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, medicines, suppliers, bills, analytics, users, ocr_service, patients
import uvicorn
import os

app = FastAPI(title="Medicine Management AI System", redirect_slashes=False)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
# Note: Frontend expects /api/auth, /api/medicines etc.
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(medicines.router, prefix="/api/medicines", tags=["Medicines"])
app.include_router(suppliers.router, prefix="/api/suppliers", tags=["Suppliers"])
app.include_router(bills.router, prefix="/api/bills", tags=["Bills"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])
app.include_router(ocr_service.router, prefix="/api/ocr", tags=["OCR & Diet"]) # /api/predictions, /api/stats/...
app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])

@app.on_event("startup")
async def startup_db_client():
    from pymongo import MongoClient
    import re
    mongo_uri = re.sub(r'[\x00-\x20\x7F-\x9F]', '', os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017"))
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
        client.server_info()
        print(f"--- BACKEND CONNECTED TO MONGODB AT {mongo_uri} ---")
    except Exception as e:
        print(f"--- CRITICAL: BACKEND FAILED TO CONNECT TO MONGODB: {e} ---")

@app.get("/")
def read_root():
    return {"message": "Medicine Management AI System API (Python Version)"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"--- STARTING API SERVER ON PORT {port} ---")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
