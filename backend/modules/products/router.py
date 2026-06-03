import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import get_settings
from core.database import get_db
from core.dependencies import get_current_user
from modules.farmers.service import get_farmer_by_user
from modules.products.schemas import ProductCreate, ProductResponse, ProductEnrichedResponse
from modules.products.service import (
    create_product,
    get_product,
    list_products,
    save_product_image,
    run_cv_pipeline,
    get_quality_report,
)

settings = get_settings()
router = APIRouter(prefix="/products", tags=["products"])


@router.post("/create", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def add_product(
    data: ProductCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    farmer = await get_farmer_by_user(db, current_user["sub"])
    if farmer is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Must register as a farmer first")
    product = await create_product(db, current_user["sub"], data)
    return product


@router.post("/upload-image", status_code=status.HTTP_200_OK)
async def upload_product_image(
    product_id: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    product = await get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    if str(product.farmer_id) != current_user["sub"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your product")

    upload_dir = Path(settings.UPLOAD_DIR) / "products"
    upload_dir.mkdir(parents=True, exist_ok=True)

    MAX = settings.MAX_UPLOAD_SIZE
    content = await file.read(MAX + 1)
    if len(content) > MAX:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large")

    ALLOWED_CONTENT_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file type")

    ext = ALLOWED_CONTENT_TYPES[file.content_type]
    filename = f"{uuid.uuid4()}{ext}"
    filepath = upload_dir / filename

    with open(filepath, "wb") as f:
        f.write(content)

    await save_product_image(db, product_id, filename)
    report = await run_cv_pipeline(db, product_id, str(filepath))

    return {
        "message": "Image uploaded and AI verification complete",
        "filename": filename,
        "ai_verification": {
            "freshness_score": report.freshness_score,
            "grade": report.grade,
            "defect_detected": report.defect_detected,
            "confidence": report.confidence,
        },
    }


@router.get("", response_model=list[ProductEnrichedResponse])
async def get_products(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    category_id: str | None = None,
    farmer_id: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    products = await list_products(db, skip=skip, limit=limit, category_id=category_id, farmer_id=farmer_id)
    result = []
    for p in products:
        report = await get_quality_report(db, str(p.id))
        ai_info = None
        if report:
            ai_info = {
                "grade": report.grade,
                "freshness": report.freshness_score,
                "defect": report.defect_detected,
                "confidence": report.confidence,
            }
        images = []
        if p.images:
            import json
            images = json.loads(p.images)
        result.append(ProductEnrichedResponse(
            product=ProductResponse(
                id=str(p.id),
                farmer_id=str(p.farmer_id),
                name=p.name,
                description=p.description,
                price=p.price,
                unit=p.unit,
                quantity_available=p.quantity_available,
                images=images,
                is_organic=p.is_organic,
                quality_grade=p.quality_grade,
                is_ai_verified=p.is_ai_verified,
                is_active=p.is_active,
            ),
            ai_verification=ai_info,
        ))
    return result


@router.get("/{product_id}", response_model=ProductEnrichedResponse)
async def get_product_by_id(product_id: str, db: AsyncSession = Depends(get_db)):
    product = await get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    report = await get_quality_report(db, product_id)
    ai_info = None
    if report:
        ai_info = {
            "grade": report.grade,
            "freshness": report.freshness_score,
            "defect": report.defect_detected,
            "confidence": report.confidence,
        }
    images = []
    if product.images:
        import json
        images = json.loads(product.images)
    return ProductEnrichedResponse(
        product=ProductResponse(
            id=str(product.id),
            farmer_id=str(product.farmer_id),
            name=product.name,
            description=product.description,
            price=product.price,
            unit=product.unit,
            quantity_available=product.quantity_available,
            images=images,
            is_organic=product.is_organic,
            quality_grade=product.quality_grade,
            is_ai_verified=product.is_ai_verified,
            is_active=product.is_active,
        ),
        ai_verification=ai_info,
    )
