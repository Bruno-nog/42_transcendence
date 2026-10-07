from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import requests
from passlib.context import CryptContext
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta
import os
from database import get_db, engine
from models import User, Media, Reviews, Base
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user


class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    username: str | None = None
    bio: str | None = None

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
tmdb_url = "https://api.themoviedb.org/3"
tmdb_api = os.getenv("TMDB_API_KEY")

@app.get("/users/me")
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "bio": current_user.bio,
        "created_at": current_user.created_at
    }

@app.patch("/users/me")
def update_my_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_data.username is not None:
        current_user.username = user_data.username

    if user_data.bio is not None:
        current_user.bio = user_data.bio

    db.commit()
    db.refresh(current_user)

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "bio": current_user.bio,
        "created_at": current_user.created_at
    }

@app.get("/users/{user_id}")
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado"
        )

    return {
        "id": user.id,
        "username": user.username,
        "bio": user.bio,
        "created_at": user.created_at
    }

@app.post("/register")
def register(user: UserRegister):
    db = next(get_db())
    exists = db.query(User).filter(User.email == user.email).first()
    if exists:
        return {"Error": "email already registered"}
    else:
        new_user = User(username=user.username, email=user.email, hashed_password=pwd_context.hash(user.password))
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully", "Username": user.username}

@app.post("/login")
def login(user: UserLogin):
    db = next(get_db())
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        return {"error": "Email not found"}
    is_valid = pwd_context.verify(user.password, db_user.hashed_password)
    if not is_valid:
        return {"error": "Wrong password"}
    token = jwt.encode(
        {"sub": str(db_user.id), "exp": datetime.utcnow() + timedelta(minutes=120)},
        os.getenv("SECRET_KEY"),
        algorithm="HS256"
    )
    return {"token": token}

@app.get("/search")
def search_movie(title: str, db: Session = Depends(get_db)):
    response = requests.get(
        f"{tmdb_url}/search/movie", 
        params={"api_key": tmdb_api, "query": title, "language": "pt-BR"}
    )
    results = response.json().get("results", [])
    
    if not results:
        raise HTTPException(status_code=404, detail="Filme não encontrado!")
        
    movie = results[0]
    exists = db.query(Media).filter(Media.external_id == str(movie["id"])).first()
    
    if exists:
        return exists

    release_date = movie.get("release_date", "")
    release_year = int(release_date.split("-")[0]) if release_date else None
    poster_path = movie.get("poster_path")
    cover_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None

    new_media = Media(
        external_id=str(movie["id"]),
        media_type="film",
        title=movie["title"],
        description=movie.get("overview"),
        cover_url=cover_url,
        release_year=release_year
    )
    db.add(new_media)
    db.commit()
    db.refresh(new_media)
    
    return new_media

@app.get("/search/tmdb")
def search_tmdb_movies(title: str):
    response = requests.get(
        f"{tmdb_url}/search/movie", 
        params={"api_key": tmdb_api, "query": title, "language": "pt-BR"}
    )
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Erro ao consultar o TMDB")
        
    results = response.json().get("results", [])
    
    if not results:
        raise HTTPException(status_code=404, detail="Nenhum filme encontrado!")
        
    movies = []
    for movie in results:
        release_date = movie.get("release_date", "")
        release_year = int(release_date.split("-")[0]) if release_date and "-" in release_date else None
        poster_path = movie.get("poster_path")
        cover_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None

        movies.append({
            "external_id": str(movie["id"]),
            "media_type": "film",
            "title": movie.get("title"),
            "description": movie.get("overview"),
            "cover_url": cover_url,
            "release_year": release_year
        })
    
    return movies

@app.get("/movies")
def list_movies(limit: int = 100, db: Session = Depends(get_db)):
    # Busca as mídias salvas ordenando pelas mais recentes
    movies = db.query(Media).order_by(Media.created_at.desc()).limit(limit).all()
    return movies

@app.get("/movies/{tmdb_id}")
def get_movie_details(tmdb_id: str, db: Session = Depends(get_db)):
    # Se o filme já estiver cadastrado no banco local, retorna do banco
    media = db.query(Media).filter(Media.external_id == str(tmdb_id)).first()
    
    if media:
        return media

    # Se não existir no banco local, busca no TMDB e apenas RETORNA (sem salvar no banco)
    response = requests.get(
        f"{tmdb_url}/movie/{tmdb_id}",
        params={"api_key": tmdb_api, "language": "pt-BR"}
    )
    
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Filme não encontrado no TMDB")
        
    movie = response.json()

    genres_list = [g["name"] for g in movie.get("genres", [])]
    genres_str = ", ".join(genres_list) if genres_list else None

    release_date = movie.get("release_date", "")
    release_year = int(release_date.split("-")[0]) if release_date and "-" in release_date else None

    poster_path = movie.get("poster_path")
    cover_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None

    # Retorna o objeto em memória com o mesmo formato do modelo Media
    return {
        "external_id": str(movie["id"]),
        "media_type": "film",
        "title": movie.get("title"),
        "description": movie.get("overview"),
        "cover_url": cover_url,
        "release_year": release_year,
        "genres": genres_str
    }