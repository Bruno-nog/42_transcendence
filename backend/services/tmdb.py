import os
from typing import Any

import requests
from fastapi import HTTPException


TMDB_URL = "https://api.themoviedb.org/3"
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
IMAGE_URL = "https://image.tmdb.org/t/p/w500"


def _request(path: str, **params: Any) -> requests.Response:
    response = requests.get(
        f"{TMDB_URL}/{path}",
        params={"api_key": TMDB_API_KEY, "language": "pt-BR", **params},
        timeout=10,
    )
    return response


def release_year(release_date: str | None) -> int | None:
    if release_date and len(release_date) >= 4 and release_date[:4].isdigit():
        return int(release_date[:4])
    return None


def cover_url(poster_path: str | None) -> str | None:
    return f"{IMAGE_URL}{poster_path}" if poster_path else None


def movie_summary(movie: dict[str, Any]) -> dict[str, Any]:
    return {
        "external_id": str(movie["id"]),
        "media_type": "film",
        "title": movie.get("title"),
        "description": movie.get("overview"),
        "cover_url": cover_url(movie.get("poster_path")),
        "release_year": release_year(movie.get("release_date")),
    }


def search_movies(title: str) -> list[dict[str, Any]]:
    response = _request("search/movie", query=title)
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Erro ao consultar o TMDB")

    results = response.json().get("results", [])
    if not results:
        raise HTTPException(status_code=404, detail="Nenhum filme encontrado!")
    return [movie_summary(movie) for movie in results]


def get_movie(external_id: str) -> dict[str, Any]:
    response = _request(f"movie/{external_id}")
    if response.status_code != 200:
        raise HTTPException(
            status_code=404,
            detail="Filme não encontrado no TMDB",
        )

    movie = response.json()
    summary = movie_summary(movie)
    summary["genres"] = ", ".join(
        genre["name"] for genre in movie.get("genres", [])
    ) or None
    return summary
