from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from modules.delivery.models import Delivery


async def get_delivery_by_order(db: AsyncSession, order_id: str) -> Delivery | None:
    result = await db.execute(select(Delivery).where(Delivery.order_id == order_id))
    return result.scalar_one_or_none()


async def update_delivery_status(db: AsyncSession, order_id: str, status: str) -> Delivery | None:
    delivery = await get_delivery_by_order(db, order_id)
    if delivery:
        delivery.status = status
        await db.flush()
        await db.refresh(delivery)
    return delivery
