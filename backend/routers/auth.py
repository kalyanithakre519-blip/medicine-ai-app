from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from schemas import UserCreate, UserLogin, UserDB
from database import users_collection
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import timedelta, datetime

router = APIRouter()

@router.post("/register", response_model=dict)
async def register(user: UserCreate):
    print(f"DEBUG: Registering user {user.email}")
    try:
        existing_user = await users_collection.find_one({"email": user.email})
        if existing_user:
            print(f"DEBUG: User {user.email} already exists")
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user_dict = user.dict()
        user_dict["password"] = get_password_hash(user.password)
        
        print(f"DEBUG: Inserting user into database")
        # Insert
        result = await users_collection.insert_one(user_dict)
        print(f"DEBUG: User inserted with ID {result.inserted_id}")
        
        # Generate Token immediately for auto-login
        access_token_expires = timedelta(days=30)
        access_token = create_access_token(
            data={"sub": user.email, "id": str(result.inserted_id), "role": user.role}, 
            expires_delta=access_token_expires
        )
        
        return {
            "_id": str(result.inserted_id),
             "name": user.name,
             "email": user.email,
             "role": user.role,
             "token": access_token
        }
    except Exception as e:
        print(f"DEBUG: Registration error: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=dict)
async def login(user_in: UserLogin):
    log_file = "auth_debug_new.log"
    log_msg = f"\n[{datetime.now()}] LOGIN ATTEMPT: {user_in.email}\n"
    try:
        user = await users_collection.find_one({"email": user_in.email})
        if not user:
            log_msg += "RESULT: User not found in DB\n"
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        
        is_valid = verify_password(user_in.password, user["password"])
        log_msg += f"RESULT: Password valid = {is_valid}\n"
        
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(days=30)
        token_data = {"sub": user["email"], "id": str(user["_id"]), "role": user.get("role", "pharmacist")}
        access_token = create_access_token(
            data=token_data, 
            expires_delta=access_token_expires
        )
        log_msg += "SUCCESS: Token generated\n"
        
        return {
             "_id": str(user["_id"]),
             "name": user.get("name"),
             "email": user.get("email"),
             "role": user.get("role"),
             "token": access_token
        }
    except Exception as e:
        log_msg += f"LOGIN ERROR: {str(e)}\n"
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        try:
            with open(log_file, "a") as f: f.write(log_msg)
        except: print(f"Log fail: {log_msg}")

@router.get("/profile", response_model=UserDB)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    try:
        return current_user
    except Exception as e:
        print(f"ERROR in profile route: {e}")
        raise HTTPException(status_code=500, detail=str(e))
