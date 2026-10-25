from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Media
from services.tmdb import get_movie, search_movies, get_popular_movies

router = APIRouter(tags=["media"])


@router.get("/search")
def search_movie(title: str, db: Session = Depends(get_db)):
    movie = search_movies(title)[0]
    existing = db.query(Media).filter(Media.external_id == movie["external_id"]).first()
    if existing:
        return existing
    new_media = Media(**movie)
    db.add(new_media)
    db.commit()
    db.refresh(new_media)
    return new_media


@router.get("/search/tmdb")
def search_tmdb_movies(title: str):
    return search_movies(title)

@router.get("/media")
def list_movies(limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Media).order_by(Media.created_at.desc()).limit(limit).all()

@router.get("/media/{tmdb_id}")
def get_movie_details(tmdb_id: str, db: Session = Depends(get_db)):
    media = db.query(Media).filter(Media.external_id == str(tmdb_id)).first()

    if media:
        if not media.genres:
            movie = get_movie(tmdb_id)
            media.genres = movie.get("genres")
            db.commit()
            db.refresh(media)
        return media

    return get_movie(tmdb_id)


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
