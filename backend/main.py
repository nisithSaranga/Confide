from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from database import db, users_collection
from models import UserRegister, UserLogin
from auth_service import hash_password, verify_password, create_token, verify_token
from datetime import datetime

app = FastAPI(title="Confide API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
async def verify(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return {"userId": user_id}