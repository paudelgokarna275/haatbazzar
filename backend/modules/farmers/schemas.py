from pydantic import BaseModel


class FarmerCreate(BaseModel):
    farm_name: str
    farm_description: str | None = None
    farm_address: str | None = None
    farm_city: str | None = None
    farm_state: str | None = None
    farm_size: float | None = None


class FarmerResponse(BaseModel):
    id: str
    user_id: str
    farm_name: str
    farm_description: str | None
    farm_address: str | None
    farm_city: str | None
    farm_state: str | None
    farm_size: float | None
    is_verified: bool
    rating: float
