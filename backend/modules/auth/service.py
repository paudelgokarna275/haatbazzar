from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from modules.auth.models import User
from modules.auth.schemas import RegisterRequest
from core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token


async def register_user(db: AsyncSession, data: RegisterRequest) -> User:
    user = User(
        email=data.email,
        phone=data.phone,
        full_name=data.full_name,
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user is None or not verify_password(password, user.hashed_password):
        return None
    return user


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


def generate_tokens(user_id: str) -> dict:
    access_token = create_access_token({"sub": user_id})
    refresh_token = create_refresh_token({"sub": user_id})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


def refresh_access_token(refresh_token: str) -> dict | None:
    payload = decode_token(refresh_token)
    if payload is None:
        return None
    user_id = payload.get("sub")
    if user_id is None:
        return None
    access_token = create_access_token({"sub": user_id})
    return {"access_token": access_token, "token_type": "bearer"}
