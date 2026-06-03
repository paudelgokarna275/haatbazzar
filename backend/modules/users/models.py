from sqlalchemy import String, Text, Date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from core.database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    state: Mapped[str | None] = mapped_column(String(100), nullable=True)
    country: Mapped[str | None] = mapped_column(String(100), nullable=True)
    pincode: Mapped[str | None] = mapped_column(String(20), nullable=True)
    date_of_birth: Mapped[Date | None] = mapped_column(Date, nullable=True)
