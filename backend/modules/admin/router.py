from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.dependencies import get_current_user
from modules.auth.models import User
from modules.farmers.models import Farmer
from modules.orders.models import Order
from modules.products.models import Product

router = APIRouter(prefix="/admin", tags=["admin"])


async def require_admin(current_user: dict = Depends(get_current_user)):
    role = current_user.get("role", "")
    if role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


@router.get("/dashboard")
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    _=Depends(require_admin),
):
    user_count = (await db.execute(select(func.count(User.id)))).scalar()
    farmer_count = (await db.execute(select(func.count(Farmer.id)))).scalar()
    product_count = (await db.execute(select(func.count(Product.id)))).scalar()
    order_count = (await db.execute(select(func.count(Order.id)))).scalar()
    return {
        "users": user_count,
        "farmers": farmer_count,
        "products": product_count,
        "orders": order_count,
    }


@router.get("/users")
async def list_users(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _=Depends(require_admin),
):
    result = await db.execute(select(User).offset(skip).limit(limit))
    users = result.scalars().all()
    return [{"id": str(u.id), "email": u.email, "full_name": u.full_name, "role": u.role, "is_active": u.is_active} for u in users]


@router.patch("/users/{user_id}/verify")
async def verify_farmer(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_admin),
):
    result = await db.execute(select(Farmer).where(Farmer.user_id == user_id))
    farmer = result.scalar_one_or_none()
    if farmer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer not found")
    farmer.is_verified = True
    await db.flush()
    return {"message": "Farmer verified successfully"}
