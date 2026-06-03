from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    price: float = Field(gt=0)
    quantity: float = Field(ge=0)
    description: str | None = Field(default=None, max_length=2000)
    category_id: str | None = None
    unit: str = Field(default="kg", max_length=20)
    is_organic: bool = False


class ProductResponse(BaseModel):
    id: str
    farmer_id: str
    name: str
    description: str | None
    price: float
    unit: str
    quantity_available: float
    images: list[str] | None
    is_organic: bool
    quality_grade: str | None
    is_ai_verified: bool
    is_active: bool


class ProductEnrichedResponse(BaseModel):
    product: ProductResponse
    ai_verification: dict | None


class QualityReportResponse(BaseModel):
    freshness_score: float
    grade: str
    defect_detected: bool
    disease_detected: bool
    confidence: float
