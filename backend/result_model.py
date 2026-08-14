from pydantic import BaseModel

class SaveResult(BaseModel):
    condition: str
    confidence: float