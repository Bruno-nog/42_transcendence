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


# ---------------------------------------------------------------------------
# Schemas (shown in /docs)
# ---------------------------------------------------------------------------

class ErrorMessage(BaseModel):
    """Body returned with every error."""
    detail: str


class MediaOut(BaseModel):
    """A movie as returned by the public API."""
    id: int
    external_id: str
    media_type: str
    title: str
    description: str | None = None
    cover_url: str | None = None
    release_year: int | None = None
    genres: str | None = None


class MediaCreate(BaseModel):
    """Body for POST: the movie id on TMDB."""
    external_id: str = Field(
        min_length=1,
        description="Movie id on TMDB (themoviedb.org)",
        examples=["27205"],
    )


class MediaUpdate(BaseModel):
    """Body for PUT: the new values of the editable fields."""
    title: str = Field(min_length=1, max_length=200, examples=["Inception"])
    description: str | None = Field(default=None, examples=["A thief who steals secrets through dreams."])
    cover_url: str | None = Field(default=None, examples=["https://image.tmdb.org/t/p/w500/poster.jpg"])
    release_year: int | None = Field(default=None, ge=1888, le=2100, examples=[2010])
    genres: str | None = Field(default=None, examples=["Action, Science Fiction"])


# Error responses listed in /docs
COMMON_ERRORS = {
    401: {"model": ErrorMessage, "description": "Missing or invalid API key"},
    429: {"model": ErrorMessage, "description": "Too many requests (limit: 30 per minute)"},
    503: {"model": ErrorMessage, "description": "Public API is not configured on the server"},
}
NOT_FOUND = {404: {"model": ErrorMessage, "description": "Movie not found"}}


# ---------------------------------------------------------------------------
# Security: API key
# ---------------------------------------------------------------------------

# Reads the "X-API-Key" header; Swagger shows an "Authorize" button for it
api_key_header = APIKeyHeader(
    name="X-API-Key",
    auto_error=False,
    description="Public API key (PUBLIC_API_KEY in .env)",
)


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


# ---------------------------------------------------------------------------
# Security: rate limiting
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

# Every route in this router is rate limited and requires a valid API key
router = APIRouter(
    prefix="/api/v1",
    tags=["public api"],
    dependencies=[Depends(rate_limit), Depends(verify_api_key)],
    responses=COMMON_ERRORS,
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


def get_media_or_404(db: Session, media_id: int) -> Media:
    """Find a movie by its id or stop the request with 404."""
    media = db.query(Media).filter(Media.id == media_id).first()
    if media is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return media


@router.get(
    "/media",
    response_model=list[MediaOut],
    summary="List movies",
    description="Return all movies stored in the database, ordered by id.",
)
def list_media(db: Session = Depends(get_db)):
    movies = db.query(Media).order_by(Media.id).all()
    return [media_to_dict(movie) for movie in movies]


@router.get(
    "/media/{media_id}",
    response_model=MediaOut,
    summary="Get one movie",
    description="Return the movie with the given internal id.",
    responses=NOT_FOUND,
)
def get_media(media_id: int, db: Session = Depends(get_db)):
    media = get_media_or_404(db, media_id)
    return media_to_dict(media)


@router.post(
    "/media",
    status_code=201,
    response_model=MediaOut,
    summary="Import a movie from TMDB",
    description=(
        "Download a movie from TMDB by its TMDB id and save it in the database. "
        "Returns the created movie with its new internal id."
    ),
    responses={
        404: {"model": ErrorMessage, "description": "Movie not found on TMDB"},
        409: {"model": ErrorMessage, "description": "Movie already exists"},
    },
)
def create_media(data: MediaCreate, db: Session = Depends(get_db)):
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


@router.put(
    "/media/{media_id}",
    response_model=MediaOut,
    summary="Replace a movie",
    description=(
        "Replace the editable fields of a movie. "
        "Fields that are not sent are set to null."
    ),
    responses=NOT_FOUND,
)
def update_media(media_id: int, data: MediaUpdate, db: Session = Depends(get_db)):
    media = get_media_or_404(db, media_id)
    for field, value in data.model_dump().items():
        setattr(media, field, value)
    db.commit()
    db.refresh(media)
    return media_to_dict(media)


@router.delete(
    "/media/{media_id}",
    status_code=204,
    summary="Delete a movie",
    description="Delete a movie. Movies that already have reviews cannot be deleted.",
    responses={
        **NOT_FOUND,
        409: {"model": ErrorMessage, "description": "Movie has reviews and cannot be deleted"},
    },
)
def delete_media(media_id: int, db: Session = Depends(get_db)):
    media = get_media_or_404(db, media_id)

    review = db.query(Reviews).filter(Reviews.media_id == media.id).first()
    if review is not None:
        raise HTTPException(
            status_code=409,
            detail="Movie has reviews and cannot be deleted",
        )

    db.delete(media)
    db.commit()