import os
import secrets
import time
from collections import defaultdict, deque

from fastapi import APIRouter, Depends, HTTPException, Request, Security
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models import Media, Reviews
from services.tmdb import get_movie

# Reads the "X-API-Key" header; Swagger shows an "Authorize" button for it
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def verify_api_key(api_key: str | None = Security(api_key_header)) -> str:
    """Reject the request unless it carries the correct API key."""
    expected_key = os.getenv("PUBLIC_API_KEY")
    if not expected_key:
        raise HTTPException(status_code=503, detail="Public API is not configured")
    if api_key is None:
        raise HTTPException(status_code=401, detail="Missing API key")
    # compare_digest avoids leaking the key through response timing
    if not secrets.compare_digest(api_key, expected_key):
        raise HTTPException(status_code=401, detail="Invalid API key")
    return api_key

RATE_LIMIT_REQUESTS = 30
RATE_LIMIT_WINDOW_SECONDS = 60

# Times of recent requests for each client, kept in memory
request_history: dict[str, deque] = defaultdict(deque)


def rate_limit(request: Request) -> None:
    """Allow at most RATE_LIMIT_REQUESTS per window for each client."""
    if request.client is None:
        client_id = "unknown"
    else:
        client_id = request.client.host

    now = time.monotonic()
    history = request_history[client_id]

    # Forget requests that are older than the window
    while history and now - history[0] > RATE_LIMIT_WINDOW_SECONDS:
        history.popleft()

    if len(history) >= RATE_LIMIT_REQUESTS:
        retry_after = int(RATE_LIMIT_WINDOW_SECONDS - (now - history[0])) + 1
        raise HTTPException(
            status_code=429,
            detail="Too many requests, try again later",
            headers={"Retry-After": str(retry_after)},
        )

    history.append(now)

# Every route in this router requires a valid API key
router = APIRouter(
    prefix="/api/v1",
    tags=["public api"],
    dependencies=[Depends(rate_limit), Depends(verify_api_key)],
)

def media_to_dict(media: Media) -> dict:
    """Convert a Media row into plain JSON-friendly data."""
    return {
        "id": media.id,
        "external_id": media.external_id,
        "media_type": media.media_type,
        "title": media.title,
        "description": media.description,
        "cover_url": media.cover_url,
        "release_year": media.release_year,
        "genres": media.genres,
    }

@router.get("/media")
def list_media(db: Session = Depends(get_db)):
    """Return all movies stored in the database."""
    movies = db.query(Media).order_by(Media.id).all()
    return [media_to_dict(movie) for movie in movies]

class MediaCreate(BaseModel):
    """Body for POST: the movie id on TMDB."""
    external_id: str = Field(min_length=1, examples=["27205"])


class MediaUpdate(BaseModel):
    """Body for PUT: the new values of the editable fields."""
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    cover_url: str | None = None
    release_year: int | None = Field(default=None, ge=1888, le=2100)
    genres: str | None = None


def get_media_or_404(db: Session, media_id: int) -> Media:
    """Find a movie by its id or stop the request with 404."""
    media = db.query(Media).filter(Media.id == media_id).first()
    if media is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return media


@router.get("/media/{media_id}")
def get_media(media_id: int, db: Session = Depends(get_db)):
    """Return one movie."""
    media = get_media_or_404(db, media_id)
    return media_to_dict(media)


@router.post("/media", status_code=201)
def create_media(data: MediaCreate, db: Session = Depends(get_db)):
    """Import a movie from TMDB into the database."""
    existing = db.query(Media).filter(Media.external_id == data.external_id).first()
    if existing is not None:
        raise HTTPException(status_code=409, detail="Movie already exists")

    # get_movie raises 404 if TMDB does not know this id
    movie = get_movie(data.external_id)
    new_media = Media(**movie)
    db.add(new_media)
    db.commit()
    db.refresh(new_media)
    return media_to_dict(new_media)


@router.put("/media/{media_id}")
def update_media(media_id: int, data: MediaUpdate, db: Session = Depends(get_db)):
    """Replace the editable fields of a movie."""
    media = get_media_or_404(db, media_id)
    for field, value in data.model_dump().items():
        setattr(media, field, value)
    db.commit()
    db.refresh(media)
    return media_to_dict(media)


@router.delete("/media/{media_id}", status_code=204)
def delete_media(media_id: int, db: Session = Depends(get_db)):
    """Delete a movie that has no reviews."""
    media = get_media_or_404(db, media_id)

    review = db.query(Reviews).filter(Reviews.media_id == media.id).first()
    if review is not None:
        raise HTTPException(
            status_code=409,
            detail="Movie has reviews and cannot be deleted",
        )

    db.delete(media)
    db.commit()