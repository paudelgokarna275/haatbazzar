from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from modules.products.models import Product, QualityReport
from modules.products.schemas import ProductResponse, ProductEnrichedResponse

router = APIRouter(prefix="/marketplace", tags=["marketplace"])


@router.get("/featured")
async def get_featured_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).where(Product.is_active == True, Product.is_ai_verified == True).limit(10)
    )
    products = result.scalars().all()
    enriched = []
    for p in products:
        report = await db.execute(select(QualityReport).where(QualityReport.product_id == p.id))
        report = report.scalar_one_or_none()
        ai_info = None
        if report:
            ai_info = {
                "grade": report.grade,
                "freshness": report.freshness_score,
                "defect": report.defect_detected,
                "confidence": report.confidence,
            }
        enriched.append({
            "product": {
                "id": str(p.id),
                "name": p.name,
                "price": p.price,
                "unit": p.unit,
                "quantity_available": p.quantity_available,
                "quality_grade": p.quality_grade,
                "is_ai_verified": p.is_ai_verified,
            },
            "ai_verification": ai_info,
        })
    return enriched


@router.get("/search")
async def search_products(
    q: str = "",
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    organic: bool | None = None,
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    query = select(Product).where(Product.is_active == True)
    if q:
        query = query.where(Product.name.ilike(f"%{q}%"))
    if category:
        query = query.where(Product.category_id == category)
    if min_price is not None:
        query = query.where(Product.price >= min_price)
    if max_price is not None:
        query = query.where(Product.price <= max_price)
    if organic is not None:
        query = query.where(Product.is_organic == organic)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    products = result.scalars().all()
    enriched = []
    for p in products:
        report = await db.execute(select(QualityReport).where(QualityReport.product_id == p.id))
        report = report.scalar_one_or_none()
        ai_info = None
        if report:
            ai_info = {
                "grade": report.grade,
                "freshness": report.freshness_score,
                "defect": report.defect_detected,
                "confidence": report.confidence,
            }
        enriched.append({
            "product": {
                "id": str(p.id),
                "name": p.name,
                "price": p.price,
                "unit": p.unit,
                "quantity_available": p.quantity_available,
                "quality_grade": p.quality_grade,
                "is_ai_verified": p.is_ai_verified,
            },
            "ai_verification": ai_info,
        })
    return {"count": len(enriched), "products": enriched}
