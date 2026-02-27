from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from database import users_collection
from schemas import UserDB
from bson import ObjectId

import os
from dotenv import load_dotenv

load_dotenv()

# Robust Authentication Middleware
SECRET_KEY = "your_jwt_secret_key_here"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=30))
    to_encode.update({"exp": expire})
    # Ensure ID is in token for frontend
    if "id" not in to_encode and "_id" in to_encode:
        to_encode["id"] = str(to_encode["_id"])
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(request: Request, token: str = Depends(oauth2_scheme)):
    log_file = "auth_debug_new.log" # Use local path for safety
    
    # Fallback to manual extraction if Depends(oauth2_scheme) fails
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    log_msg = ""
    try:
        log_msg += f"\n[{datetime.now()}] --- AUTH ATTEMPT ---\n"
        if not token:
            log_msg += "ERROR: No token found in header or dependency\n"
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        log_msg += f"Token (first 25): {token[:25]}...\n"
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            uid = payload.get("id")
            sub = payload.get("sub")
            log_msg += f"Payload ID: {uid}, Sub: {sub}\n"

            identifier = uid or sub
            if not identifier:
                log_msg += "ERROR: No ID or Sub in payload\n"
                raise HTTPException(status_code=401, detail="Invalid token payload")

            user = None
            if uid and len(str(uid)) == 24:
                user = await users_collection.find_one({"_id": ObjectId(uid)})
                if user: log_msg += f"Found user by ID: {uid}\n"
            
            if not user and sub:
                user = await users_collection.find_one({"email": sub})
                if user: log_msg += f"Found user by Email: {sub}\n"

            if not user:
                log_msg += f"ERROR: User not found for identifier: {identifier}\n"
                raise HTTPException(status_code=401, detail="User not found")

            # Prep for JSON
            if "_id" in user:
                user["id"] = str(user.pop("_id"))
            
            log_msg += "SUCCESS: Authentication complete\n"
            return user
        except JWTError as e:
            log_msg += f"JWT ERROR: {str(e)}\n"
            raise HTTPException(status_code=401, detail=f"JWT Error: {str(e)}")
        except Exception as e:
            log_msg += f"GENERAL ERROR: {str(e)}\n"
            raise HTTPException(status_code=401, detail=str(e))
    finally:
        try:
            with open(log_file, "a") as f:
                f.write(log_msg)
        except:
            print(f"Failed to write to auth log: {log_msg}")

async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    return current_user

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized (Admin only)")
    return current_user
