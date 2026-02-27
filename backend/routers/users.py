from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from schemas import UserDB, UserBase
from auth import get_current_user
from database import users_collection
from bson import ObjectId
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from typing import Optional
import os
import traceback

router = APIRouter()

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    # Add other fields as needed

def send_email_notification(email_to: str, subject: str, message: str):
    # This is a placeholder. Configure SMTP settings in .env for production.
    sender_email = os.getenv("SMTP_EMAIL", "noreply@medsystem.com")
    sender_password = os.getenv("SMTP_PASSWORD", "password")
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))

    if sender_email == "noreply@medsystem.com":
        print(f"Mock Email to {email_to}: {subject} - {message}")
        return

    try:
        msg = MIMEText(message)
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = email_to

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email_to, msg.as_string())
    except Exception as e:
        print(f"Failed to send email: {e}")

@router.put("/profile", response_model=UserDB)
async def update_user_profile(
    user_update: UserProfileUpdate, 
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks = None
):
    try:
        update_data = {k: v for k, v in user_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
            
        user_id = current_user.get("id") or str(current_user.get("_id"))
        
        if not user_id:
            raise HTTPException(status_code=401, detail="User ID not found in session")

        # Check email uniqueness if updating email
        if "email" in update_data and update_data["email"] != current_user.get("email"):
            existing = await users_collection.find_one({"email": update_data["email"]})
            if existing:
                raise HTTPException(status_code=400, detail="Email already in use")

        # Perform update
        result = await users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        
        # Fetch updated user
        updated_user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found after update")
            
        # Prepare for Pydantic (UserDB expects id, and populate_by_name=True uses _id alias)
        updated_user["id"] = str(updated_user.pop("_id"))
        
        if background_tasks:
            background_tasks.add_task(
                send_email_notification, 
                updated_user.get("email"), 
                "Profile Updated", 
                f"Hello {updated_user.get('name')}, your profile was successfully updated."
            )
                
        return updated_user
    except Exception as e:
        print(f"PROFILE UPDATE ERROR: {str(e)}")
        import traceback
        print(traceback.format_exc())
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")

@router.get("/notifications")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    # Placeholder for in-app notifications if implemented in DB
    return [{"id": 1, "message": "Welcome to the system!", "read": False}]
