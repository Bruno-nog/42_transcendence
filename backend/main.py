from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import Base, engine
from routers.auth import router as auth_router
from routers.media import router as media_router
from routers.reviews import router as reviews_router
from routers.users import router as users_router


BASE_DIR = Path(__file__).resolve().parent
UPLOADS_DIR = BASE_DIR / "uploads"
AVATAR_DIR = UPLOADS_DIR / "avatars"


def create_app() -> FastAPI:
    """Create and configure the API application."""
    AVATAR_DIR.mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(bind=engine)

    application = FastAPI(title="42 Transcendence API")
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "https://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    application.mount(
        "/uploads",
        StaticFiles(directory=UPLOADS_DIR),
        name="uploads",
    )

    application.include_router(auth_router)
    application.include_router(users_router)
    application.include_router(media_router)
    application.include_router(reviews_router)
    return application


app = create_app()
