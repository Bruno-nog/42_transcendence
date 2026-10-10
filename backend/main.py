from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import or_
import requests
from passlib.context import CryptContext
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta
import os
from database import get_db, engine
from models import User, Media, Reviews, Favorite, Friendship, Base
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user
from pathlib import Path
import uuid

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

BASE_DIR = Path(__file__).resolve().parent
UPLOADS_DIR = BASE_DIR / "uploads"
AVATAR_DIR = UPLOADS_DIR / "avatars"

ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

AVATAR_DIR.mkdir(parents=True, exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory=UPLOADS_DIR),
    name="uploads"
)

@app.get("/users/me")
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "bio": current_user.bio,
        "avatar_url": current_user.avatar_url,
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
        "avatar_url": current_user.avatar_url,
        "created_at": current_user.created_at
    }

@app.get("/users/search")
def search_users(
    username: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    users = (
        db.query(User)
        .filter(
            User.username.ilike(f"%{username}%"),
            User.id != current_user.id,
        )
        .limit(20)
        .all()
    )

    return [
        {
            "id": user.id,
            "username": user.username,
            "bio": user.bio,
            "avatar_url": user.avatar_url,
        }
        for user in users
    ]


@app.get("/users/me/friends")
def get_my_friends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    friendships = (
        db.query(Friendship)
        .filter(
            or_(
                Friendship.user_id == current_user.id,
                Friendship.friend_id == current_user.id,
            )
        )
        .all()
    )

    friend_ids = [
        friendship.friend_id
        if friendship.user_id == current_user.id
        else friendship.user_id
        for friendship in friendships
    ]

    if not friend_ids:
        return []

    friends = db.query(User).filter(User.id.in_(friend_ids)).all()

    return [
        {
            "id": friend.id,
            "username": friend.username,
            "bio": friend.bio,
            "avatar_url": friend.avatar_url,
        }
        for friend in friends
    ]


@app.post("/users/me/friends/{user_id}")
def add_friend(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Você não pode adicionar a si mesmo",
        )

    friend = db.query(User).filter(User.id == user_id).first()

    if not friend:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado",
        )

    first_id, second_id = sorted([current_user.id, user_id])

    existing = (
        db.query(Friendship)
        .filter(
            Friendship.user_id == first_id,
            Friendship.friend_id == second_id,
        )
        .first()
    )

    if existing:
        return {"message": "Usuário já está na sua lista de amigos"}

    friendship = Friendship(
        user_id=first_id,
        friend_id=second_id,
    )

    db.add(friendship)
    db.commit()

    return {"message": "Amigo adicionado com sucesso"}


@app.delete("/users/me/friends/{user_id}")
def remove_friend(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Operação inválida",
        )

    first_id, second_id = sorted([current_user.id, user_id])

    friendship = (
        db.query(Friendship)
        .filter(
            Friendship.user_id == first_id,
            Friendship.friend_id == second_id,
        )
        .first()
    )

    if not friendship:
        raise HTTPException(
            status_code=404,
            detail="Amizade não encontrada",
        )

    db.delete(friendship)
    db.commit()

    return {"message": "Amigo removido com sucesso"}

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

@app.post("/users/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Formato de imagem não permitido"
        )

    extension = ALLOWED_TYPES[file.content_type]
    filename = f"{uuid.uuid4()}{extension}"
    file_path = AVATAR_DIR / filename

    content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    current_user.avatar_url = f"/uploads/avatars/{filename}"

    db.commit()
    db.refresh(current_user)

    return {
        "avatar_url": current_user.avatar_url
    }

@app.get("/users/me/favorites")
def get_my_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorites = (
        db.query(Media)
        .join(Favorite, Favorite.media_id == Media.id)
        .filter(Favorite.user_id == current_user.id)
        .order_by(Favorite.created_at.desc())
        .all()
    )

    return favorites


@app.post("/users/me/favorites/{external_id}")
def add_favorite(
    external_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    media = (
        db.query(Media)
        .filter(Media.external_id == external_id)
        .first()
    )

    if not media:
        response = requests.get(
            f"{tmdb_url}/movie/{external_id}",
            params={"api_key": tmdb_api, "language": "pt-BR"},
            timeout=10,
        )

        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="Filme não encontrado no TMDB",
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail="Erro ao consultar o TMDB",
            )

        movie = response.json()
        release_date = movie.get("release_date", "")
        release_year = (
            int(release_date[:4])
            if len(release_date) >= 4 and release_date[:4].isdigit()
            else None
        )
        poster_path = movie.get("poster_path")
        cover_url = (
            f"https://image.tmdb.org/t/p/w500{poster_path}"
            if poster_path
            else None
        )

        media = Media(
            external_id=str(movie["id"]),
            media_type="film",
            title=movie.get("title", "Sem título"),
            description=movie.get("overview"),
            cover_url=cover_url,
            release_year=release_year,
            genres=", ".join(
                genre["name"] for genre in movie.get("genres", [])
            ) or None,
        )

        db.add(media)
        db.flush()

    existing = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id,
            Favorite.media_id == media.id,
        )
        .first()
    )

    if existing:
        return {"message": "Filme já está nos favoritos"}

    favorite = Favorite(
        user_id=current_user.id,
        media_id=media.id,
    )

    db.add(favorite)
    db.commit()

    return {"message": "Filme adicionado aos favoritos"}


@app.delete("/users/me/favorites/{external_id}")
def remove_favorite(
    external_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    media = (
        db.query(Media)
        .filter(Media.external_id == external_id)
        .first()
    )

    if not media:
        raise HTTPException(
            status_code=404,
            detail="Filme não encontrado",
        )

    favorite = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id,
            Favorite.media_id == media.id,
        )
        .first()
    )

    if not favorite:
        raise HTTPException(
            status_code=404,
            detail="Filme não está nos seus favoritos",
        )

    db.delete(favorite)
    db.commit()

    return {"message": "Filme removido dos favoritos"}

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