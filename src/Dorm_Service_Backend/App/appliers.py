from sqlalchemy.sql.expression import false
from sqlalchemy.sql.operators import exists
from fastapi import APIRouter, status, HTTPException
from pydantic import BaseModel #used for producing schemas
import models
from database import SessionLocal
from datetime import datetime

db = SessionLocal()

router = APIRouter(
    prefix="/appliers",
    tags=["appliers"],
)


@router.get("/asked/{request_id}")
async def get_all_appliers_user_detail_and_appliers_status_for_this_request(request_id: int):
    db.commit()
    return db.query(models.User, models.Applier).\
        join(models.Applier, models.Applier.applier_id == models.User.user_id).\
        filter( models.Applier.request_id == request_id).all()


class Apply(BaseModel): #serializer
    applierId: int
    requestId: int

    class Config:
        orm_mode= True

@router.post('/apply', status_code= status.HTTP_201_CREATED)
async def make_a_application(item: Apply):

    new_applier = models.Applier(  
        applier_id = item.applierId,
        request_id = item.requestId,
        status = 0
    )
    db_apply_exist = db.query(models.Applier).filter(new_applier.applier_id == models.Applier.applier_id, new_applier.request_id == models.Applier.request_id).first()
    if db_apply_exist is not None:
        raise HTTPException(status_code=409, detail="Apply already exists") # code: 409 means conflict 
    db.add(new_applier)
    db.commit()

    return