from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.dependencies import get_current_user
from modules.cart.schemas import CartAddRequest, CartItemResponse, CartResponse
from modules.cart.service import add_to_cart, get_cart, remove_from_cart, clear_cart
from modules.products.service import get_product

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("", response_model=CartResponse)
async def fetch_cart(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    items = await get_cart(db, current_user["sub"])
    total = 0.0
    cart_items = []
    for item in items:
        product = await get_product(db, str(item.product_id))
        if product:
            total += product.price * item.quantity
            cart_items.append(CartItemResponse(id=str(item.id), product_id=str(item.product_id), quantity=item.quantity))
    return CartResponse(items=cart_items, total=total)


@router.post("", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
async def add_item(
    data: CartAddRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    product = await get_product(db, data.product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    item = await add_to_cart(db, current_user["sub"], data.product_id, data.quantity)
    return CartItemResponse(id=str(item.id), product_id=str(item.product_id), quantity=item.quantity)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_item(
    item_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await remove_from_cart(db, current_user["sub"], item_id)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def empty_cart(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await clear_cart(db, current_user["sub"])
