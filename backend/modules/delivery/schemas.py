from datetime import datetime
from pydantic import BaseModel


class DeliveryResponse(BaseModel):
    id: str
    order_id: str
    status: str
    delivery_address: str | None
    delivery_person: str | None
    delivery_phone: str | None
    estimated_delivery: datetime | None
    delivered_at: datetime | None
