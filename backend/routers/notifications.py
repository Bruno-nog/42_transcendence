from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, update
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User, Notification, Media, Reviews


router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def get_user_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notifications = (
        db.query(Notification, User, Media)
        .join(User, Notification.actor_id == User.id)
        .outerjoin(Reviews, Notification.review_id == Reviews.id)
        .outerjoin(Media, Reviews.media_id == Media.id)
        .filter(Notification.read_at.is_(None), Notification.recipient_id == current_user.id)
        .all()
    )

    result = {
			"user_id": current_user.id,
			"unread_total": len(notifications),
			"notifications": [
				{
					"id": notification.id,
					"actor_id": notification.actor_id,
					"actor_name": user.username,
					"message": notification.notification_type,
					"movie_title": media.title if media else None,
					"created_at": notification.created_at,
				}
				for notification, user, media in notifications
			],
		}


    return result


@router.patch("/read-all")
def mark_all_notifications_as_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = db.execute(
        update(Notification)
        .where(
            Notification.recipient_id == current_user.id,
            Notification.read_at.is_(None),
        )
        .values(read_at=func.now())
    )
    db.commit()

    return {"updated": result.rowcount}
