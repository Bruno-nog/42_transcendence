from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Media, Reviews, User
from schemas import ReviewCreate


router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/{review_id}")
def get_review(review_id: int, db: Session = Depends(get_db)):
    return db.query(Reviews).filter(Reviews.id == review_id).first()


@router.post("")
def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    media = db.query(Media).filter(Media.external_id == review_data.mediaId).first()
    if not media:
        raise HTTPException(status_code=404, detail="Filme não encontrado")

    new_review = Reviews(
        user_id=current_user.id,
        media_id=media.id,
        review=review_data.review,
        rate=review_data.rate,
        acting=review_data.acting,
        direction=review_data.direction,
        photography=review_data.photography,
        screenplay=review_data.screenplay,
        soundtrack=review_data.soundtrack,
        liked=review_data.like,
        watched_before=review_data.whatchedBefore,
        date_film=review_data.dateFilm,
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review
