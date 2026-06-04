from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.dependencies import get_current_user
from modules.reviews.schemas import ReviewCreate, ReviewResponse
from modules.reviews.service import create_review, get_product_reviews

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def add_review(
    data: ReviewCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    review = await create_review(db, current_user["sub"], data.product_id, data.rating, data.comment)
    return review


@router.get("/{product_id}", response_model=list[ReviewResponse])
async def get_reviews(product_id: str, db: AsyncSession = Depends(get_db)):
    return await get_product_reviews(db, product_id)
