from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from modules.users.models import UserProfile
from modules.users.schemas import UserProfileUpdate


async def get_profile(db: AsyncSession, user_id: str) -> UserProfile | None:
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == user_id))
    return result.scalar_one_or_none()


async def upsert_profile(db: AsyncSession, user_id: str, data: UserProfileUpdate) -> UserProfile:
    profile = await get_profile(db, user_id)
    if profile is None:
        profile = UserProfile(user_id=user_id)
        db.add(profile)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    await db.flush()
    await db.refresh(profile)
    return profile
