from datetime import datetime, timezone
from bson import ObjectId
from database import users_collection, results_collection


class UserRepository:
    """Mediates all database access for the users collection.
    No other part of the application should import or touch
    users_collection directly — this is the one place that does."""

    async def find_by_email(self, email: str):
        return await users_collection.find_one({"email": email})

    async def find_by_id(self, user_id: str):
        return await users_collection.find_one({"_id": ObjectId(user_id)})

    async def find_by_reset_token(self, token: str):
        user = await users_collection.find_one({"reset_token": token})
        if user and user.get("reset_token_expiry") and user["reset_token_expiry"].tzinfo is None:
            user["reset_token_expiry"] = user["reset_token_expiry"].replace(tzinfo=timezone.utc)
        return user

    async def create(self, email: str, password_hash: str) -> str:
        result = await users_collection.insert_one({
            "email": email,
            "password_hash": password_hash,
            "created_at": datetime.now(timezone.utc),
        })
        return str(result.inserted_id)

    async def update_password(self, user_id: str, new_password_hash: str):
        await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password_hash": new_password_hash}}
        )

    async def set_reset_token(self, user_id, token: str, expiry):
        await users_collection.update_one(
            {"_id": user_id},
            {"$set": {"reset_token": token, "reset_token_expiry": expiry}}
        )

    async def reset_password_with_token(self, user_id, new_password_hash: str):
        await users_collection.update_one(
            {"_id": user_id},
            {"$set": {"password_hash": new_password_hash},
             "$unset": {"reset_token": "", "reset_token_expiry": ""}}
        )


class ResultRepository:
    """Mediates all database access for the results collection."""

    async def create(self, user_id: str, condition: str, confidence: float):
        await results_collection.insert_one({
            "user_id": user_id,
            "predicted_condition": condition,
            "confidence_score": confidence,
            "created_at": datetime.now(timezone.utc),
        })

    async def find_by_user(self, user_id: str):
        results = await results_collection.find({"user_id": user_id}).sort("created_at", -1).to_list(100)
        for r in results:
            r["_id"] = str(r["_id"])
            if r.get("created_at") and r["created_at"].tzinfo is None:
                r["created_at"] = r["created_at"].replace(tzinfo=timezone.utc)
        return results


# Single shared instances — routes import and use these directly.
user_repository = UserRepository()
result_repository = ResultRepository()