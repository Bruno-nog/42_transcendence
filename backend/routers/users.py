from collections import Counter
from datetime import datetime
from pathlib import Path
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import or_
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Favorite, Friendship, Media, Reviews, User
from schemas import UserUpdate
from services.tmdb import get_movie


router = APIRouter(prefix="/users", tags=["users"])
BASE_DIR = Path(__file__).resolve().parent.parent
AVATAR_DIR = BASE_DIR / "uploads" / "avatars"
ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
ONLINE_TIMEOUT_SECONDS = 90


def is_user_online(user: User) -> bool:
    if user.last_seen_at is None:
        return False
    elapsed = (datetime.utcnow() - user.last_seen_at).total_seconds()
    return elapsed <= ONLINE_TIMEOUT_SECONDS


def user_profile(user: User, include_email: bool = False) -> dict:
    profile = {
        "id": user.id,
        "username": user.username,
        "bio": user.bio,
        "avatar_url": user.avatar_url,
        "created_at": user.created_at,
    }
    if include_email:
        profile["email"] = user.email
    return profile


@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user)):
    return user_profile(current_user, include_email=True)


@router.patch("/me")
def update_my_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user_data.username is not None:
        current_user.username = user_data.username
    if user_data.bio is not None:
        current_user.bio = user_data.bio
    db.commit()
    db.refresh(current_user)
    return user_profile(current_user, include_email=True)


@router.get("/search")
def search_users(
    username: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    users = (
        db.query(User)
        .filter(User.username.ilike(f"%{username}%"), User.id != current_user.id)
        .limit(20)
        .all()
    )
    return [user_profile(user) for user in users]


@router.get("/me/friends")
def get_my_friends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    friendships = db.query(Friendship).filter(
        or_(
            Friendship.user_id == current_user.id,
            Friendship.friend_id == current_user.id,
        )
    ).all()
    friend_ids = [
        friendship.friend_id
        if friendship.user_id == current_user.id
        else friendship.user_id
        for friendship in friendships
    ]
    friends = db.query(User).filter(User.id.in_(friend_ids)).all() if friend_ids else []
    return [
        {**user_profile(friend), "is_online": is_user_online(friend)}
        for friend in friends
    ]


@router.post("/me/friends/{user_id}")
def add_friend(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user_id == current_user.id:
        raise HTTPException(400, "Você não pode adicionar a si mesmo")
    if not db.query(User).filter(User.id == user_id).first():
        raise HTTPException(404, "Usuário não encontrado")

    first_id, second_id = sorted([current_user.id, user_id])
    existing = db.query(Friendship).filter(
        Friendship.user_id == first_id,
        Friendship.friend_id == second_id,
    ).first()
    if existing:
        return {"message": "Usuário já está na sua lista de amigos"}

    db.add(Friendship(user_id=first_id, friend_id=second_id))
    db.commit()
    return {"message": "Amigo adicionado com sucesso"}


@router.delete("/me/friends/{user_id}")
def remove_friend(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user_id == current_user.id:
        raise HTTPException(400, "Operação inválida")
    first_id, second_id = sorted([current_user.id, user_id])
    friendship = db.query(Friendship).filter(
        Friendship.user_id == first_id,
        Friendship.friend_id == second_id,
    ).first()
    if not friendship:
        raise HTTPException(404, "Amizade não encontrada")
    db.delete(friendship)
    db.commit()
    return {"message": "Amigo removido com sucesso"}


@router.get("/me/recommendations")
def get_my_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    high_rated_reviews = (
        db.query(Reviews, Media)
        .join(Media, Reviews.media_id == Media.id)
        .filter(
            Reviews.user_id == current_user.id,
            Reviews.rate >= 8,
        )
        .all()
    )

    genre_counts = Counter()
    for _, media in high_rated_reviews:
        if not media.genres:
            continue
        for genre in media.genres.split(","):
            genre = genre.strip()
            if genre:
                genre_counts[genre] += 1

    if not genre_counts:
        return {
            "recommendations": [],
            "message": (
                "Você ainda não tem avaliações com nota 8 ou maior "
                "suficientes para gerar recomendações personalizadas."
            ),
        }

    preferred_genres = set(genre_counts.keys())
    reviewed_media_ids = (
        db.query(Reviews.media_id)
        .filter(Reviews.user_id == current_user.id)
        .subquery()
    )

    candidates = (
        db.query(Media)
        .filter(
            Media.id.notin_(reviewed_media_ids),
            Media.media_type.ilike("film"),
        )
        .all()
    )

    ranked_recommendations = []
    for media in candidates:
        media_genres = {
            genre.strip()
            for genre in (media.genres or "").split(",")
            if genre.strip()
        }
        matched_genres = sorted(media_genres & preferred_genres)
        if not matched_genres:
            continue

        score = sum(genre_counts[genre] for genre in matched_genres)
        ranked_recommendations.append(
            {
                "id": media.id,
                "external_id": media.external_id,
                "title": media.title,
                "media_type": media.media_type,
                "description": media.description,
                "cover_url": media.cover_url,
                "release_year": media.release_year,
                "genres": media.genres,
                "matched_genres": matched_genres,
                "recommendation_score": score,
                "reason": (
                    "Recomendado porque combina com gêneros de filmes "
                    "que você avaliou com nota 8 ou maior: "
                    + ", ".join(matched_genres)
                    + "."
                ),
            }
        )

    ranked_recommendations.sort(
        key=lambda item: (
            -item["recommendation_score"],
            -(item["release_year"] or 0),
            item["title"].lower(),
        )
    )

    return {
        "recommendations": ranked_recommendations[:10],
        "based_on": {
            "minimum_rating": 8,
            "preferred_genres": sorted(
                preferred_genres,
                key=lambda genre: (-genre_counts[genre], genre.lower()),
            ),
        },
        "message": (
            "Recomendações geradas com base nos gêneros das suas avaliações "
            "com nota 8 ou maior."
            if ranked_recommendations
            else "Não encontramos filmes disponíveis no catálogo para os seus gêneros favoritos."
        ),
    }


@router.get("/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "Usuário não encontrado")
    return {**user_profile(user), "is_online": is_user_online(user)}


@router.post("/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Formato de imagem não permitido")
    filename = f"{uuid.uuid4()}{ALLOWED_TYPES[file.content_type]}"
    with open(AVATAR_DIR / filename, "wb") as buffer:
        buffer.write(await file.read())
    current_user.avatar_url = f"/uploads/avatars/{filename}"
    db.commit()
    db.refresh(current_user)
    return {"avatar_url": current_user.avatar_url}


@router.post("/me/heartbeat")
def update_user_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.last_seen_at = datetime.utcnow()
    db.commit()
    return {"message": "Atividade atualizada"}


@router.get("/me/favorites")
def get_my_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Media)
        .join(Favorite, Favorite.media_id == Media.id)
        .filter(Favorite.user_id == current_user.id)
        .order_by(Favorite.created_at.desc())
        .all()
    )


@router.post("/me/favorites/{external_id}")
def add_favorite(
    external_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    media = db.query(Media).filter(Media.external_id == external_id).first()
    if not media:
        movie = get_movie(external_id)
        media = Media(**movie)
        db.add(media)
        db.flush()

    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.media_id == media.id,
    ).first()
    if existing:
        return {"message": "Filme já está nos favoritos"}
    db.add(Favorite(user_id=current_user.id, media_id=media.id))
    db.commit()
    return {"message": "Filme adicionado aos favoritos"}


@router.delete("/me/favorites/{external_id}")
def remove_favorite(
    external_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    media = db.query(Media).filter(Media.external_id == external_id).first()
    if not media:
        raise HTTPException(404, "Filme não encontrado")
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.media_id == media.id,
    ).first()
    if not favorite:
        raise HTTPException(404, "Filme não está nos seus favoritos")
    db.delete(favorite)
    db.commit()
    return {"message": "Filme removido dos favoritos"}