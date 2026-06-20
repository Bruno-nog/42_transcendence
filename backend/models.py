from sqlalchemy.sql import func
from database import Base
from sqlalchemy import Column, Integer, String, DateTime, Date, Boolean, Float, ForeignKey
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())

class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True)
    external_id = Column(String, nullable=False, unique=True)
    media_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    cover_url = Column(String, nullable=True)
    release_year = Column(Integer)
    genres = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())


class Reviews(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True)
    media_id = Column(Integer, ForeignKey("media.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    review = Column(String, nullable=True)
    date_film = Column(Date)
    watched_before = Column(Boolean, default=False)
    liked = Column(Boolean, default=False)
    rate = Column(Float)
    acting = Column(Float)
    direction = Column(Float)
    photography = Column(Float)
    screenplay = Column(Float)
    soundtrack = Column(Float)
    created_at = Column(DateTime, default=func.now())