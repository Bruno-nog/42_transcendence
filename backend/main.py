from fastapi import FastAPI
import requests
from passlib.context import CryptContext
from pydantic import BaseModel
from database import get_connection
from jose import jwt
from datetime import datetime, timedelta
import os

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()
tmdb_url = "https://api.themoviedb.org/3"
tmdb_api = os.getenv("TMDB_API_KEY")

@app.get("/search")
def search_movie(title: str):
    conn = get_connection()
    response = requests.get(tmdb_url + "/search/movie", params={"api_key": tmdb_api, "query": title, "language": "pt-BR"})
    results = response.json()["results"]
    if not results:
        return{"Error: Movie not found!"}
    movie = results[0]
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM media WHERE external_id = %s", (str(movie["id"]),))
    exists = cursor.fetchone()
    if exists:
        return {"message: duplicate found"}
    else:
        cursor.execute("INSERT INTO media (external_id, media_type, title, description, cover_url, release_year) VALUES (%s, %s, %s, %s, %s, %s)",
        (
            str(movie["id"]),
            "film",
            movie["title"],
            movie["overview"],
            "https://image.tmdb.org/t/p/w500" + movie["poster_path"],
            int(movie["release_date"].split("-")[0])
        ))
    conn.commit()
    cursor.close()
    conn.close()
    return movie

@app.post("/register")
def register(user: UserRegister):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
    exists = cursor.fetchone()
    if exists:
        return {"Error": "email already registered"}
    else:
        cursor.execute("INSERT INTO users (username, email, hashed_password) VALUES (%s, %s, %s)",
        (
            user.username,
            user.email,
            pwd_context.hash(user.password)
        ))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "User created succesfully", "Username": user.username}


@app.post("/login")
def login(user: UserLogin):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT email, hashed_password, id FROM users WHERE email = %s", (user.email,))
    db_user = cursor.fetchone()
    cursor.close()
    conn.close()
    if not db_user:
        return {"error": "Email not found"}
    is_valid = pwd_context.verify(user.password, db_user[1])
    if not is_valid:
        return {"error": "Wrong password"}
    token = jwt.encode(
        {"sub": str(db_user[0]), "exp": datetime.utcnow() + timedelta(minutes=120)},
        os.getenv("SECRET_KEY"),
        algorithm="HS256"
    )
    return {"token": token}
