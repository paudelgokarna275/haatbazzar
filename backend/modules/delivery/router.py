from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.dependencies import get_current_user
from modules.delivery.schemas import DeliveryResponse
from modules.delivery.service import get_delivery_by_order
from modules.orders.service import get_order

router = APIRouter(prefix="/delivery", tags=["delivery"])


@router.get("/{order_id}", response_model=DeliveryResponse)
async def get_delivery(
    order_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    order = await get_order(db, order_id)
    if order is None or str(order.buyer_id) != current_user["sub"]:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Delivery not found")
    delivery = await get_delivery_by_order(db, order_id)
    if delivery is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Delivery not found")
    return delivery
