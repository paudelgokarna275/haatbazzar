from uuid import UUID

from pydantic import BaseModel


class FarmerCreate(BaseModel):
    farm_name: str
    farm_description: str | None = None
    farm_address: str | None = None
    farm_city: str | None = None
    farm_state: str | None = None
    farm_size: float | None = None


class FarmerResponse(BaseModel):
    id: UUID
    user_id: UUID
    farm_name: str
    farm_description: str | None
    farm_address: str | None
    farm_city: str | None
    farm_state: str | None
    farm_size: float | None
    is_verified: bool
    rating: float
