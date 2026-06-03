import json
import uuid
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import get_settings
from modules.products.models import Product, QualityReport
from modules.products.schemas import ProductCreate
from ai.quality_verification.inference import predict

settings = get_settings()


async def create_product(db: AsyncSession, farmer_id: str, data: ProductCreate) -> Product:
    product = Product(
        farmer_id=farmer_id,
        name=data.name,
        price=data.price,
        quantity_available=data.quantity,
        description=data.description,
        category_id=data.category_id,
        unit=data.unit,
        is_organic=data.is_organic,
    )
    db.add(product)
    await db.flush()
    await db.refresh(product)
    return product


async def get_product(db: AsyncSession, product_id: str) -> Product | None:
    result = await db.execute(select(Product).where(Product.id == product_id))
    return result.scalar_one_or_none()


async def list_products(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 20,
    category_id: str | None = None,
    farmer_id: str | None = None,
) -> list[Product]:
    query = select(Product).where(Product.is_active == True)
    if category_id:
        query = query.where(Product.category_id == category_id)
    if farmer_id:
        query = query.where(Product.farmer_id == farmer_id)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_quality_report(db: AsyncSession, product_id: str) -> QualityReport | None:
    result = await db.execute(select(QualityReport).where(QualityReport.product_id == product_id))
    return result.scalar_one_or_none()


async def save_product_image(db: AsyncSession, product_id: str, filename: str) -> Product | None:
    product = await get_product(db, product_id)
    if product is None:
        return None
    existing = []
    if product.images:
        existing = json.loads(product.images)
    existing.append(filename)
    product.images = json.dumps(existing)
    await db.flush()
    await db.refresh(product)
    return product


async def run_cv_pipeline(db: AsyncSession, product_id: str, image_path: str) -> QualityReport:
    result = await predict(image_path)
    report = QualityReport(
        product_id=product_id,
        freshness_score=result["freshness_score"],
        grade=result["grade"],
        defect_detected=result["defect_detected"],
        defect_confidence=result.get("defect_confidence"),
        disease_detected=result["disease_detected"],
        confidence=result["confidence"],
    )
    db.add(report)

    product = await get_product(db, product_id)
    if product:
        product.quality_grade = result["grade"]
        product.is_ai_verified = True

    await db.flush()
    await db.refresh(report)
    return report
