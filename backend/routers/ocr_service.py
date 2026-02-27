from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
import pytesseract
from PIL import Image
import io
import re

router = APIRouter()

# Path to Tesseract executable (Update if necessary)
# For Windows, usually: r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# Assuming user has it installed or we just mock/use a simpler pattern matching for now if not available.
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

DISEASE_FRUIT_MAP = {
    "fever": ["Kiwi", "Orange", "Berries (Blueberries, Strawberries)"],
    "cold": ["Lemon", "Pineapple", "Ginger Tea (Not a fruit but recommended)"],
    "cough": ["Pineapple (Contains Bromelain)", "Honey (with Lemon)"],
    "headache": ["Watermelon (Hydration)", "Banana (Magnesium helps)", "Cherries"],
    "stomach pain": ["Banana", "Papaya", "Apple (Applesauce)"],
    "diabetes": ["Berries", "Cherries", "Peach", "Apricot", "Apple (with skin)"],
    "high blood pressure": ["Banana (Potassium)", "Berries", "Watermelon"],
    "deficiency": ["Guava", "Kiwi", "Spinach (Iron)", "Orange (Nitamin C)"], # General
}

def recommend_fruits(text):
    text = text.lower()
    recommendations = set()
    detected_conditions = []
    
    for condition, fruits in DISEASE_FRUIT_MAP.items():
        if condition in text:
            detected_conditions.append(condition)
            recommendations.update(fruits)
            
    if not recommendations:
        return {
            "detected_conditions": [],
            "recommendations": ["General healthy fruits: Apple, Banana, Orange"],
            "message": "No specific condition detected in text."
        }
        
    return {
        "detected_conditions": detected_conditions,
        "recommendations": list(recommendations),
        "message": f"Based on '{', '.join(detected_conditions)}', we recommend these fruits."
    }

@router.post("/upload-prescription")
async def extract_prescription_text(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Use pytesseract to extract text
        try:
            text = pytesseract.image_to_string(image)
        except Exception as e:
            # Fallback if tesseract not installed/configured
            print(f"OCR Error: {e}")
            return JSONResponse(status_code=500, content={"error": "OCR Engine not configured properly. Please install Tesseract."})
            
        # Clean text
        clean_text = " ".join(text.split())
        
        # Analyze for fruit recommendations
        fruit_rec = recommend_fruits(clean_text)
        
        # Extract potential medicine names (Simple Regex for Capitalized words > 3 chars)
        # In real app, match against DB
        potential_medicines = list(set(re.findall(r'\b[A-Z][a-z]{3,}\b', text)))
        
        return {
            "extracted_text": clean_text,
            "potential_medicines": potential_medicines[:5], # Return top 5 matches
            "dietary_recommendations": fruit_rec
        }
        
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/recommend-diet")
async def get_diet_recommendation(symptoms: str):
    return recommend_fruits(symptoms)
