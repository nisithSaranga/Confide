from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import db, users_collection, results_collection
from models import UserRegister, UserLogin
from result_model import SaveResult
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

security = HTTPBearer()

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