from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import db
from repositories import user_repository, result_repository
from models import UserRegister, UserLogin, ChangePassword, ForgotPasswordRequest, ResetPasswordRequest
from result_model import SaveResult
from auth_service import hash_password, verify_password, create_token, verify_token
from email_service import send_reset_email
from datetime import datetime, timedelta, timezone
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
import secrets

app = FastAPI(title="Confide API")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
    existing = await user_repository.find_by_email(user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)
    new_user_id = await user_repository.create(user.email, hashed)
    return {"message": "Registered successfully", "userId": new_user_id}

@app.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, credentials: UserLogin):
    user = await user_repository.find_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token(str(user["_id"]))
    return {"token": token}

@app.get("/auth/verify")
async def verify(user_id: str = Depends(get_current_user)):
    user = await user_repository.find_by_id(user_id)
    return {"userId": user_id, "email": user["email"] if user else None}

@app.post("/auth/change-password")
async def change_password(data: ChangePassword, user_id: str = Depends(get_current_user)):
    user = await user_repository.find_by_id(user_id)
    if not user or not verify_password(data.current_password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    new_hash = hash_password(data.new_password)
    await user_repository.update_password(user_id, new_hash)
    return {"message": "Password changed successfully"}

@app.post("/auth/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    user = await user_repository.find_by_email(data.email)
    if user:
        token = secrets.token_urlsafe(32)
        token_hash = hash_password(token)
        expiry = datetime.now(timezone.utc) + timedelta(minutes=RESET_TOKEN_EXPIRY_MINUTES)
        await user_repository.set_reset_token(user["_id"], token_hash, expiry)
        try:
            send_reset_email(data.email, token)
        except Exception as e:
            print(f"EMAIL SEND FAILED: {e}")  # TEMPORARY — remove once confirmed working

    # Same message whether or not the email exists — prevents this endpoint
    # from being used to check which emails are registered.
    return {"message": "If an account exists for that email, a reset link has been sent."}

@app.post("/auth/reset-password")
async def reset_password(data: ResetPasswordRequest):
    user = await user_repository.find_by_valid_reset_token(data.token)
    if not user:
        raise HTTPException(status_code=400, detail="This reset link is invalid or has expired.")

    new_hash = hash_password(data.new_password)
    await user_repository.reset_password_with_token(user["_id"], new_hash)
    return {"message": "Password reset successfully"}

@app.post("/results/save")
async def save_result(result: SaveResult, user_id: str = Depends(get_current_user)):
    await result_repository.create(user_id, result.condition, result.confidence)
    return {"message": "Result saved"}

@app.get("/results/history")
async def get_history(user_id: str = Depends(get_current_user)):
    results = await result_repository.find_by_user(user_id)
    return {"results": results}