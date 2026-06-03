from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from modules.products.models import Product
from modules.reviews.models import Review


async def create_review(db: AsyncSession, user_id: str, product_id: str, rating: int, comment: str | None = None) -> Review:
    product = await db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    if str(product.farmer_id) == user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot review your own product")
    existing = await db.execute(select(Review).where(Review.user_id == user_id, Review.product_id == product_id))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You have already reviewed this product")
    review = Review(user_id=user_id, product_id=product_id, rating=rating, comment=comment)
    db.add(review)
    await db.flush()
    await db.refresh(review)
    return review


async def get_product_reviews(db: AsyncSession, product_id: str) -> list[Review]:
    result = await db.execute(
        select(Review).where(Review.product_id == product_id).order_by(Review.created_at.desc())
    )
    return list(result.scalars().all())


async def get_product_rating(db: AsyncSession, product_id: str) -> float:
    result = await db.execute(
        select(Review).where(Review.product_id == product_id)
    )
    reviews = result.scalars().all()
    if not reviews:
        return 0.0
    return sum(r.rating for r in reviews) / len(reviews)
