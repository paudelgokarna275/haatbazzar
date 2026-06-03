from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from modules.notifications.models import Notification


async def create_notification(db: AsyncSession, user_id: str, title: str, message: str, type: str = "info") -> Notification:
    notif = Notification(user_id=user_id, title=title, message=message, type=type)
    db.add(notif)
    await db.flush()
    await db.refresh(notif)
    return notif


async def get_user_notifications(db: AsyncSession, user_id: str) -> list[Notification]:
    result = await db.execute(
        select(Notification).where(Notification.user_id == user_id).order_by(Notification.created_at.desc())
    )
    return list(result.scalars().all())


async def mark_as_read(db: AsyncSession, notification_id: str, user_id: str) -> Notification | None:
    result = await db.execute(
        select(Notification).where(Notification.id == notification_id, Notification.user_id == user_id)
    )
    notif = result.scalar_one_or_none()
    if notif:
        notif.is_read = True
        await db.flush()
        await db.refresh(notif)
    return notif
