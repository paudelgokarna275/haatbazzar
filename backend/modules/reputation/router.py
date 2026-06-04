from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from modules.reputation.models import FarmerReputation

router = APIRouter(prefix="/reputation", tags=["reputation"])


@router.get("/farmers/{farmer_id}")
async def get_farmer_reputation(farmer_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FarmerReputation).where(FarmerReputation.farmer_id == farmer_id))
    rep = result.scalar_one_or_none()
    if rep is None:
        return {"farmer_id": farmer_id, "rating": 0.0, "total_reviews": 0, "completed_orders": 0}
    return rep
