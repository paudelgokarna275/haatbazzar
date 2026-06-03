from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.dependencies import get_current_user
from modules.orders.schemas import OrderCreate, OrderResponse, OrderItemResponse
from modules.orders.service import create_order, get_order, get_order_items, list_user_orders

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/create", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def place_order(
    data: OrderCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    order = await create_order(db, current_user["sub"], data)
    items = await get_order_items(db, str(order.id))
    return OrderResponse(
        id=str(order.id),
        buyer_id=str(order.buyer_id),
        status=order.status,
        total_amount=order.total_amount,
        shipping_address=order.shipping_address,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        notes=order.notes,
        items=[OrderItemResponse(
            id=str(i.id), product_id=str(i.product_id),
            farmer_id=str(i.farmer_id), quantity=i.quantity,
            unit_price=i.unit_price,
        ) for i in items],
    )


@router.get("", response_model=list[OrderResponse])
async def get_my_orders(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await list_user_orders(db, current_user["sub"])


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order_by_id(
    order_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    order = await get_order(db, order_id)
    if order is None or str(order.buyer_id) != current_user["sub"]:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    items = await get_order_items(db, order_id)
    return OrderResponse(
        id=str(order.id),
        buyer_id=str(order.buyer_id),
        status=order.status,
        total_amount=order.total_amount,
        shipping_address=order.shipping_address,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        notes=order.notes,
        items=[OrderItemResponse(
            id=str(i.id), product_id=str(i.product_id),
            farmer_id=str(i.farmer_id), quantity=i.quantity,
            unit_price=i.unit_price,
        ) for i in items],
    )
