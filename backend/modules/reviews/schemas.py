from datetime import datetime
from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    product_id: str
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewResponse(BaseModel):
    id: str
    user_id: str
    product_id: str
    rating: int
    comment: str | None
    created_at: datetime
