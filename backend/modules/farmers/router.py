from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.dependencies import get_current_user
from modules.farmers.schemas import FarmerCreate, FarmerResponse
from modules.farmers.service import create_farmer, get_farmer_by_user, list_farmers

router = APIRouter(prefix="/farmers", tags=["farmers"])


@router.post("", response_model=FarmerResponse, status_code=status.HTTP_201_CREATED)
async def register_as_farmer(
    data: FarmerCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    existing = await get_farmer_by_user(db, current_user["sub"])
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already registered as farmer")
    farmer = await create_farmer(db, current_user["sub"], data)
    return farmer


@router.get("/me", response_model=FarmerResponse)
async def my_farmer_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    farmer = await get_farmer_by_user(db, current_user["sub"])
    if farmer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer profile not found")
    return farmer


@router.get("", response_model=list[FarmerResponse])
async def get_farmers(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    return await list_farmers(db, skip=skip, limit=limit)
