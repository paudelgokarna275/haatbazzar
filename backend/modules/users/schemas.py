from datetime import date
from pydantic import BaseModel


class UserProfileResponse(BaseModel):
    user_id: str
    bio: str | None
    avatar_url: str | None
    address: str | None
    city: str | None
    state: str | None
    country: str | None
    pincode: str | None
    date_of_birth: date | None


class UserProfileUpdate(BaseModel):
    bio: str | None = None
    avatar_url: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    country: str | None = None
    pincode: str | None = None
    date_of_birth: date | None = None
