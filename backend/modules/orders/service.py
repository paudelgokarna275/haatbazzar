from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from modules.orders.models import Order, OrderItem
from modules.orders.schemas import OrderCreate
from modules.products.models import Product


async def create_order(db: AsyncSession, buyer_id: str, data: OrderCreate) -> Order:
    total = 0.0
    order_items_data = []

    for item_data in data.items:
        result = await db.execute(select(Product).where(Product.id == item_data.product_id).with_for_update())
        product = result.scalar_one_or_none()
        if product is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {item_data.product_id} not found")
        if product.quantity_available < item_data.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Requested quantity is not available",
            )
        product.quantity_available -= item_data.quantity
        subtotal = product.price * item_data.quantity
        total += subtotal
        order_items_data.append({
            "product_id": item_data.product_id,
            "farmer_id": product.farmer_id,
            "quantity": item_data.quantity,
            "unit_price": product.price,
        })

    order = Order(
        buyer_id=buyer_id,
        total_amount=total,
        shipping_address=data.shipping_address,
        payment_method=data.payment_method,
        notes=data.notes,
    )
    db.add(order)
    await db.flush()

    for item_d in order_items_data:
        item = OrderItem(order_id=order.id, **item_d)
        db.add(item)

    await db.flush()
    await db.refresh(order)
    return order


async def get_order(db: AsyncSession, order_id: str) -> Order | None:
    result = await db.execute(select(Order).where(Order.id == order_id))
    return result.scalar_one_or_none()


async def get_order_items(db: AsyncSession, order_id: str) -> list[OrderItem]:
    result = await db.execute(select(OrderItem).where(OrderItem.order_id == order_id))
    return list(result.scalars().all())


async def list_user_orders(db: AsyncSession, user_id: str) -> list[Order]:
    result = await db.execute(
        select(Order).where(Order.buyer_id == user_id).order_by(Order.created_at.desc())
    )
    return list(result.scalars().all())


async def update_order_status(db: AsyncSession, order_id: str, status: str) -> Order | None:
    order = await get_order(db, order_id)
    if order:
        order.status = status
        await db.flush()
        await db.refresh(order)
    return order
