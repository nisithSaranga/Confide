from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import db, users_collection, results_collection
from models import UserRegister, UserLogin, ChangePassword, ForgotPasswordRequest, ResetPasswordRequest
from result_model import SaveResult
from auth_service import hash_password, verify_password, create_token, verify_token
from email_service import send_reset_email
from datetime import datetime, timedelta
from bson import ObjectId
import secrets

app = FastAPI(title="Confide API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()
RESET_TOKEN_EXPIRY_MINUTES = 30

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Shared auth check — used by every protected route below."""
    user_id = verify_token(credentials.credentials)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user_id


@app.get("/")
def root():
    return {"status": "Confide backend is running"}

@app.get("/health/db")
async def check_db():
    try:
        await db.command("ping")
        return {"database": "connected"}
    except Exception as e:
        return {"database": "connection failed", "error": str(e)}

@app.post("/auth/register")
async def register(user: UserRegister):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)
    result = await users_collection.insert_one({
        "email": user.email,
        "password_hash": hashed,
        "created_at": datetime.utcnow(),
    })
    return {"message": "Registered successfully", "userId": str(result.inserted_id)}

@app.post("/auth/login")
async def login(credentials: UserLogin):
    user = await users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token(str(user["_id"]))
    return {"token": token}

@app.get("/auth/verify")
async def verify(user_id: str = Depends(get_current_user)):
    return {"userId": user_id}

@app.post("/auth/change-password")
async def change_password(data: ChangePassword, user_id: str = Depends(get_current_user)):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user or not verify_password(data.current_password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    new_hash = hash_password(data.new_password)
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password_hash": new_hash}}
    )
    return {"message": "Password changed successfully"}

@app.post("/auth/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    user = await users_collection.find_one({"email": data.email})
    if user:
        token = secrets.token_urlsafe(32)
        expiry = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRY_MINUTES)
        await users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"reset_token": token, "reset_token_expiry": expiry}}
        )
        try:
            send_reset_email(data.email, token)
        except Exception as e:
            print(f"EMAIL SEND FAILED: {e}")  # TEMPORARY — remove once confirmed working

    # Same message whether or not the email exists — prevents this endpoint
    # from being used to check which emails are registered.
    return {"message": "If an account exists for that email, a reset link has been sent."}

@app.post("/auth/reset-password")
async def reset_password(data: ResetPasswordRequest):
    user = await users_collection.find_one({"reset_token": data.token})
    if not user or user.get("reset_token_expiry") < datetime.utcnow():
        raise HTTPException(status_code=400, detail="This reset link is invalid or has expired.")

    new_hash = hash_password(data.new_password)
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"password_hash": new_hash}, "$unset": {"reset_token": "", "reset_token_expiry": ""}}
    )
    return {"message": "Password reset successfully"}

@app.post("/results/save")
async def save_result(result: SaveResult, user_id: str = Depends(get_current_user)):
    await results_collection.insert_one({
        "user_id": user_id,
        "predicted_condition": result.condition,
        "confidence_score": result.confidence,
        "created_at": datetime.utcnow(),
    })
    return {"message": "Result saved"}

@app.get("/results/history")
async def get_history(user_id: str = Depends(get_current_user)):
    results = await results_collection.find({"user_id": user_id}).sort("created_at", -1).to_list(100)
    for r in results:
        r["_id"] = str(r["_id"])
    return {"results": results}