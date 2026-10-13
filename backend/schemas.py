from datetime import date

from pydantic import BaseModel


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


class ReviewCreate(BaseModel):
    mediaId: int
    review: str
    rate: int
    acting: int
    direction: int
    photography: int
    screenplay: int
    soundtrack: int
    like: bool
    whatchedBefore: bool
    dateFilm: date
