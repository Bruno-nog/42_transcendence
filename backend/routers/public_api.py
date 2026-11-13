import os
import secrets

from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session

from database import get_db
from models import Media

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

# Every route in this router requires a valid API key
router = APIRouter(
    prefix="/api/v1",
    tags=["public api"],
    dependencies=[Depends(verify_api_key)],
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