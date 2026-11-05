from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Follow, Media, Reviews, User


router = APIRouter(tags=["social"])


@router.get("/feed")
def get_feed(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    activities = (
        db.query(Reviews, Media, User)
        .join(Follow, Follow.following_id == Reviews.user_id)
        .join(Media, Reviews.media_id == Media.id)
        .join(User, Reviews.user_id == User.id)
        .filter(Follow.follower_id == current_user.id)
        .order_by(Reviews.created_at.desc())
        .all()
    )
    return [
        {
            "id": review.id,
            "user_id": user.id,
            "username": user.username,
            "user_avatar": user.avatar_url,
            "media_id": media.id,
            "external_id": media.external_id,
            "media_type": media.media_type,
            "title": media.title,
            "cover_url": media.cover_url,
            "release_year": media.release_year,
            "review": review.review,
            "rate": review.rate,
            "acting": review.acting,
            "direction": review.direction,
            "photography": review.photography,
            "screenplay": review.screenplay,
            "soundtrack": review.soundtrack,
            "liked": review.liked,
            "likes": review.likes,
            "watched_before": review.watched_before,
            "date_film": review.date_film,
            "created_at": review.created_at,
        }
        for review, media, user in activities
    ]
