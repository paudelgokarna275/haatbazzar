import uuid
from datetime import datetime, timezone

from sqlalchemy import Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class FarmerReputation(Base):
    __tablename__ = "farmer_reputation"

    farmer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    total_reviews: Mapped[int] = mapped_column(default=0)
    completed_orders: Mapped[int] = mapped_column(default=0)
    on_time_delivery: Mapped[float] = mapped_column(Float, default=0.0)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
