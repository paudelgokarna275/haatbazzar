from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from modules.farmers.models import Farmer
from modules.farmers.schemas import FarmerCreate


async def create_farmer(db: AsyncSession, user_id: str, data: FarmerCreate) -> Farmer:
    farmer = Farmer(user_id=user_id, **data.model_dump())
    db.add(farmer)
    await db.flush()
    await db.refresh(farmer)
    return farmer


async def get_farmer_by_user(db: AsyncSession, user_id: str) -> Farmer | None:
    result = await db.execute(select(Farmer).where(Farmer.user_id == user_id))
    return result.scalar_one_or_none()


async def get_farmer_by_id(db: AsyncSession, farmer_id: str) -> Farmer | None:
    result = await db.execute(select(Farmer).where(Farmer.id == farmer_id))
    return result.scalar_one_or_none()


async def list_farmers(db: AsyncSession, skip: int = 0, limit: int = 20) -> list[Farmer]:
    result = await db.execute(select(Farmer).offset(skip).limit(limit))
    return list(result.scalars().all())
