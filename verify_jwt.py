from jose import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from bson import ObjectId

# Replicate auth.py logic
load_dotenv(dotenv_path="backend/.env")
SECRET_KEY = os.getenv("JWT_SECRET", "your_fastapi_jwt_secret_key")
ALGORITHM = "HS256"

def create_token(user_id, email):
    expire = datetime.utcnow() + timedelta(days=30)
    data = {"sub": email, "id": str(user_id), "exp": expire}
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    test_id = str(ObjectId())
    test_email = "test@example.com"
    token = create_token(test_id, test_email)
    print(f"Generated Token: {token[:20]}...")
    decoded = decode_token(token)
    print(f"Decoded Payload: {decoded}")
    
    if str(decoded.get("id")) == test_id:
        print("SUCCESS: Token generation and decoding match!")
    else:
        print("FAILURE: Token mismatch!")
    
    print(f"Using SECRET_KEY: {SECRET_KEY}")
