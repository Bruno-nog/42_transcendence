from fastapi import FastAPI
import requests
from passlib.context import CryptContext
from pydantic import BaseModel
from database import connection
import os

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()
tmdb_url = "https://api.themoviedb.org/3"
tmdb_api = os.getenv("TMDB_API_KEY")

@app.get("/search")
def search_movie(title: str):
    response = requests.get(tmdb_url + "/search/movie", params={"api_key": tmdb_api, "query": title, "language": "pt-BR"})
    results = response.json()["results"]
    if not results:
        return{"Error: Movie not found!"}
    movie = results[0]
    cursor = connection.cursor()
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
    connection.commit()
    cursor.close()
    return movie

@app.post("/register")
def register(user: UserRegister):
    user_data = user(username="john", email="john@gmail.com", password="12345")
    print("aaaaaaaaaaa", user.username)
    # cursor = connection.cursor()
    # cursor.execute("INSERT INTO ")