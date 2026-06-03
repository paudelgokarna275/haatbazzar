from uuid import UUID

from pydantic import BaseModel, Field


class CartAddRequest(BaseModel):
    product_id: str
    quantity: float = Field(default=1.0, gt=0, le=10000)


class CartItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    quantity: float


class CartResponse(BaseModel):
    items: list[CartItemResponse]
    total: float
