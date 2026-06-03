from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from modules.cart.models import CartItem


async def add_to_cart(db: AsyncSession, user_id: str, product_id: str, quantity: float) -> CartItem:
    result = await db.execute(
        select(CartItem).where(CartItem.user_id == user_id, CartItem.product_id == product_id)
    )
    item = result.scalar_one_or_none()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.add(item)
    await db.flush()
    await db.refresh(item)
    return item


async def get_cart(db: AsyncSession, user_id: str) -> list[CartItem]:
    result = await db.execute(select(CartItem).where(CartItem.user_id == user_id))
    return list(result.scalars().all())


async def remove_from_cart(db: AsyncSession, user_id: str, item_id: str):
    await db.execute(
        delete(CartItem).where(CartItem.id == item_id, CartItem.user_id == user_id)
    )
    await db.flush()


async def clear_cart(db: AsyncSession, user_id: str):
    await db.execute(delete(CartItem).where(CartItem.user_id == user_id))
    await db.flush()
