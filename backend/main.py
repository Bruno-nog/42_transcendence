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

@app.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"username": current_user.username, "email": current_user.email}

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

@app.get("/movies")
def list_movies(limit: int = 100, db: Session = Depends(get_db)):
    # Busca as mídias salvas ordenando pelas mais recentes
    movies = db.query(Media).order_by(Media.created_at.desc()).limit(limit).all()
    return movies

@app.get("/movies/{tmdb_id}")
def get_movie_details(tmdb_id: str, db: Session = Depends(get_db)):
    # 1. Busca primeiro na base de dados local pelo external_id (ID do TMDB)
    media = db.query(Media).filter(Media.external_id == str(tmdb_id)).first()
    
    if media:
        return media

    # 2. Se não existir localmente, busca os detalhes diretamente na API do TMDB
    response = requests.get(
        f"{tmdb_url}/movie/{tmdb_id}",
        params={"api_key": tmdb_api, "language": "pt-BR"}
    )
    
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Filme não encontrado no TMDB")
        
    movie = response.json()

    # Extrai os gêneros retornados pelo TMDB e junta em uma string (ex: "Ação, Aventura")
    genres_list = [g["name"] for g in movie.get("genres", [])]
    genres_str = ", ".join(genres_list) if genres_list else None

    # Trata a data de lançamento para extrair o ano
    release_date = movie.get("release_date", "")
    release_year = int(release_date.split("-")[0]) if release_date else None

    # Monta a URL do pôster
    poster_path = movie.get("poster_path")
    cover_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None

    # 3. Salva os detalhes na base de dados local
    new_media = Media(
        external_id=str(movie["id"]),
        media_type="film",
        title=movie["title"],
        description=movie.get("overview"),
        cover_url=cover_url,
        release_year=release_year,
        genres=genres_str
    )
    
    db.add(new_media)
    db.commit()
    db.refresh(new_media)

    return new_media