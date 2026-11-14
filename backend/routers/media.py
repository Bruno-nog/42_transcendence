from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models import Media, Reviews
from services.tmdb import get_movie, search_movies, get_popular_movies


router = APIRouter(tags=["media"])


AVERAGE_FIELDS = (
    "rate",
    "acting",
    "direction",
    "photography",
    "screenplay",
    "soundtrack",
)


def media_with_averages(media: Media, averages: dict | None = None) -> dict:
    result = {
        column.name: getattr(media, column.name)
        for column in Media.__table__.columns
    }
    result["averages"] = averages or {
        field: None
        for field in AVERAGE_FIELDS
    }
    return result


def get_media_averages(db: Session, media_id: int) -> dict:
    averages = db.query(
        *[
            func.avg(getattr(Reviews, field)).label(field)
            for field in AVERAGE_FIELDS
        ]
    ).filter(Reviews.media_id == media_id).one()
    return {
        field: round(float(getattr(averages, field)), 2)
        if getattr(averages, field) is not None
        else None
        for field in AVERAGE_FIELDS
    }

@router.get("/search")
def search_movie(title: str, db: Session = Depends(get_db)):
    movie = search_movies(title)[0]

    existing = db.query(Media).filter(
        Media.external_id == movie["external_id"]
    ).first()

    if existing:
        if not existing.genres:
            details = get_movie(existing.external_id)
            existing.genres = details.get("genres")
            db.commit()
            db.refresh(existing)

        return media_with_averages(
            existing,
            get_media_averages(db, existing.id)
        )

    movie = get_movie(movie["external_id"])

    new_media = Media(**movie)
    db.add(new_media)
    db.commit()
    db.refresh(new_media)

    return media_with_averages(
        new_media,
        get_media_averages(db, new_media.id)
    )


@router.get("/search/tmdb")
def search_tmdb_movies(title: str):
    return search_movies(title)

@router.get("/media")
def list_movies(limit: int = 100, db: Session = Depends(get_db)):
    movies = db.query(Media).order_by(Media.created_at.desc()).limit(limit).all()
    return [
        media_with_averages(movie, get_media_averages(db, movie.id))
        for movie in movies
    ]

@router.get("/media/{tmdb_id}")
def get_movie_details(tmdb_id: str, db: Session = Depends(get_db)):
    media = db.query(Media).filter(Media.external_id == str(tmdb_id)).first()

    if media:
        if not media.genres:
            movie = get_movie(tmdb_id)
            media.genres = movie.get("genres")
            db.commit()
            db.refresh(media)
        return media_with_averages(media, get_media_averages(db, media.id))

    movie = get_movie(tmdb_id)
    movie["averages"] = {
        field: None
        for field in AVERAGE_FIELDS
    }
    return movie

@router.post("/movies/populate")
def populate_movies(total: int = 50, db: Session = Depends(get_db)):
    added_count = 0
    page = 1
    
    while added_count < total and page <= 5:
        tmdb_movies = get_popular_movies(page=page)
        if not tmdb_movies:
            break
            
        for movie_data in tmdb_movies:
            if added_count >= total:
                break
                
            existing = db.query(Media).filter(Media.external_id == movie_data["external_id"]).first()
            if not existing:
                # Se precisar dos géneros detalhados no populate, podes chamar o get_movie(movie_data["external_id"])
                detailed_movie = get_movie(movie_data["external_id"])
                new_media = Media(**detailed_movie)
                db.add(new_media)
                db.commit()
                added_count += 1
                
        page += 1
        
    return {"message": f"{added_count} filmes adicionados com sucesso ao banco de dados!"}

@router.get("/media/{media_id}/reviews")
def get_media_reviews(media_id: int, db: Session = Depends(get_db)):
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Mídia não encontrada")

    return db.query(Reviews).filter(Reviews.media_id == media_id).all()
