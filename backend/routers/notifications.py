from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Media, ReviewLike, Reviews, User
from schemas import ReviewCreate

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/quantity")
def get_user_notifications_qty(current_user: User = Depends(get_current_user)):
	return 7