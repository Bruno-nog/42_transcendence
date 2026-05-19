from fastapi import FastAPI
import requests
from dotenv import load_dotenv
import os
load_dotenv()

app = FastAPI()
tmdb_url = "https://api.themoviedb.org/3"
tmdb_api = os.getenv("TMDB_API_KEY")

@app.get("/search")
def route_search(title: str):
    response = requests.get(tmdb_url + "/search/movie", params={"api_key": tmdb_api, "query": title, "language": "pt-BR"})
    return response.json()["results"]