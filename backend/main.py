from fastapi import FastAPI
import requests
from passlib.context import CryptContext
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta
import os
from database import get_db, engine
from models import User, Media, Reviews, Base

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()
Base.metadata.create_all(bind=engine)
tmdb_url = "https://api.themoviedb.org/3"
tmdb_api = os.getenv("TMDB_API_KEY")

@app.get("/search")
def search_movie(title: str):
    db = next(get_db())

    response = requests.get(tmdb_url + "/search/movie", params={"api_key": tmdb_api, "query": title, "language": "pt-BR"})
    results = response.json()["results"]
    if not results:
        return{"Error: Movie not found!"}
    movie = results[0]
    exists = db.query(Media).filter(Media.external_id == str(movie["id"])).first()
    if exists:
        return {"message: duplicate found"}
    else:
        new_media = Media(external_id=str(movie["id"]),
    media_type="film",
    title=movie["title"],
    description=movie["overview"],
    cover_url="https://image.tmdb.org/t/p/w500" + movie["poster_path"],
    release_year=int(movie["release_date"].split("-")[0]))
    db.add(new_media)
    db.commit()
    return movie

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
