import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, Boolean, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class Farmer(Base):
    __tablename__ = "farmers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), unique=True, nullable=False)
    farm_name: Mapped[str] = mapped_column(String(255), nullable=False)
    farm_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    farm_address: Mapped[str | None] = mapped_column(Text, nullable=True)
    farm_city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    farm_state: Mapped[str | None] = mapped_column(String(100), nullable=True)
    farm_size: Mapped[float | None] = mapped_column(Float, nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    verification_document: Mapped[str | None] = mapped_column(String(500), nullable=True)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
