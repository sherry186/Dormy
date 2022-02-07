from sqlalchemy.sql.elements import Null
from sqlalchemy.sql.expression import null
from fastapi import APIRouter, status, HTTPException
import models
from database import SessionLocal
from pydantic import BaseModel
from schemas import User as UserSchema
from sqlalchemy.sql import func

db = SessionLocal()

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

class Login(BaseModel): #serializer
    userName: str
    password: str
    class Config:
        orm_mode= True

class Point(BaseModel):
    service_id: int
    avg_rating: float
    counts: int
    level_id: int
class UserInfo(BaseModel):
    userId: int
    userName: str
    gender: str
    phoneNum: str
    fbUrl: str
    dormId: str
    userPoints: list

@router.get('/') 
async def get_all_users():
    return db.query(models.User).all()

@router.get("/{user_id}")
async def get_specific_user(user_id: int):
    q = db.query(models.User).filter(models.User.user_id == user_id)
    if q.count():
        user = db.query(models.User).filter(models.User.user_id == user_id).first()
        serviceCount = 1
        list = []
        while(serviceCount < 5):
            pointInfo = db.query(models.UserPoint).filter(models.UserPoint.user_id == user.user_id, models.UserPoint.service_id == serviceCount).first()
            list.append(Point(
                service_id = pointInfo.service_id,
                avg_rating = pointInfo.avg_rating,
                counts = pointInfo.counts,
                level_id = pointInfo.level_id
            ))
            serviceCount += 1

        user_info = UserInfo(
            userId = user.user_id,
            userName = user.user_name,
            gender = user.gender,
            phoneNum = user.phone_num,
            fbUrl = user.fb_url,
            dormId = user.dorm_id,
            userPoints = list
        )
        return user_info
    else:
        raise HTTPException(status_code=404, detail="User id not found in User list")

@router.post("/login") #The reason I use post is because get cannot have a request body, and I didn't know how to handle this situation.
async def test_login(login: Login):
    q = db.query(models.User).filter(models.User.user_name == login.userName, models.User.password == login.password)
    if q.count():
        user = db.query(models.User).filter(models.User.user_name == login.userName, models.User.password == login.password).first()
        return user.user_id
    else:
        raise HTTPException(status_code=404, detail="The combination of username and password not found in User list")


@router.post("/", status_code= status.HTTP_201_CREATED)
async def create_new_user(user: UserSchema):
    newUser = models.User(
        user_name = user.userName,
        gender = user.gender,
        phone_num = user.phoneNum,
        fb_url = user.fbUrl,
        dorm_id = user.dormID,
        password = user.password
    )
    db_name_exist = db.query(models.User).filter(newUser.user_name == models.User.user_name).first()
    if db_name_exist is not None:
        raise HTTPException(status_code=404, detail="User name already exists")
    else:
        db.add(newUser)
        db.commit()
        serviceId = 1
        while(serviceId < 5):
            newUserInputEntry = models.UserPoint(
                user_id = newUser.user_id,
                service_id = serviceId,
            )
            db.add(newUserInputEntry)
            db.commit()
            serviceId += 1

        return newUser.user_id

class Rate(BaseModel): #serializer
    requestId:      int  
    applierId:      int  # 對哪一個applier 評分
    score:          int

    class Config:
        orm_mode= True

@router.patch("/rateRequest", status_code = status.HTTP_200_OK)
async def rate_request(item: Rate):
    requestId = item.requestId
    applierId = item.applierId
    score = item.score

    q = db.query(models.Applier).filter(models.Applier.request_id == requestId, models.Applier.applier_id == applierId)

    if q.count():
        applier = q.first()
        applier.rating = score
        # db.add(applier)
        # db.commit()
        
        
        serviceId = db.query(models.Request).filter(models.Request.request_id == applier.request_id).first().service_id

        
        # 計算平均
        rating_array = db.query(models.Applier.rating).\
            join(models.Request, models.Request.request_id == models.Applier.request_id).\
            filter( models.Applier.applier_id == applierId, models.Request.service_id == serviceId).all()
        
        total = 0
        for i in range(len(rating_array)):
            if rating_array[i].rating:
                total += rating_array[i].rating
        avg = total / len(rating_array)
        
        

        # get user points 資料
        user_points = db.query(models.UserPoint).filter(models.UserPoint.service_id == serviceId, models.UserPoint.user_id == applierId).first()
        
        # 更新 user points
        user_points.avg_rating = avg
        user_points.counts += 1
        levels = db.query(models.Level.level_id).filter(avg >= models.Level.rating_threshold, user_points.counts >= models.Level.count_threshold).all()

        max_level = 1
        for i in range(len(levels)):
            if max_level < levels[i].level_id:
                max_level = levels[i].level_id
        user_points.level_id = max_level
        db.add(applier, user_points)
        db.commit()
        
        return "rated successfully"
    
    else:
        raise HTTPException(status_code=404, detail="Application data not in Appliers table")





