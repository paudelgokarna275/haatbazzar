from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    product_id: str
    quantity: float = Field(gt=0)


class OrderCreate(BaseModel):
    items: list[OrderItemCreate] = Field(min_length=1, max_length=50)
    shipping_address: str | None = None
    payment_method: str | None = None
    notes: str | None = None


class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    farmer_id: str
    quantity: float
    unit_price: float


class OrderResponse(BaseModel):
    id: str
    buyer_id: str
    status: str
    total_amount: float
    shipping_address: str | None
    payment_method: str | None
    payment_status: str
    notes: str | None
    items: list[OrderItemResponse] = []
