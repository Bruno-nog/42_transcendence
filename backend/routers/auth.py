import os
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import UserLogin, UserRegister


router = APIRouter(tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        return {"Error": "email already registered"}

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=pwd_context.hash(user.password),
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully", "Username": user.username}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        return {"error": "Email not found"}
    if not pwd_context.verify(user.password, db_user.hashed_password):
        return {"error": "Wrong password"}

    token = jwt.encode(
        {
            "sub": str(db_user.id),
            "exp": datetime.utcnow() + timedelta(minutes=120),
        },
        os.getenv("SECRET_KEY"),
        algorithm="HS256",
    )
    return {"token": token}
