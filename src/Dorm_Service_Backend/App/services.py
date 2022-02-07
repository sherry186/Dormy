from fastapi import APIRouter
import models
from database import SessionLocal

db = SessionLocal()

router = APIRouter(
    prefix="/services",
    tags=["services"],
)


@router.get("/")
async def get_all_services():
    return db.query(models.Service).all()

@router.get("/levels/")
async def get_all_levels_info():
    return db.query(models.Level).all()
