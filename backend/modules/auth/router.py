from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from modules.auth.schemas import RegisterRequest, LoginRequest, TokenResponse, RefreshRequest
from modules.auth.service import register_user, authenticate_user, generate_tokens, refresh_access_token, get_user_by_email
from main import _is_login_rate_limited

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing = await get_user_by_email(db, data.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Account already exists")
    user = await register_user(db, data)
    return generate_tokens(str(user.id))


@router.post("/login", response_model=TokenResponse)
async def login(request: Request, data: LoginRequest, db: AsyncSession = Depends(get_db)):
    ip = request.client.host if request.client else "unknown"
    if _is_login_rate_limited(ip):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many login attempts, try again later")
    user = await authenticate_user(db, data.email, data.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return generate_tokens(str(user.id))


@router.post("/refresh", response_model=TokenResponse)
async def refresh(data: RefreshRequest):
    result = refresh_access_token(data.refresh_token)
    if result is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    return result
