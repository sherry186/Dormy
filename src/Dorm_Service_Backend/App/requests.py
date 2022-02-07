import requests
from sqlalchemy.sql.expression import false
from sqlalchemy.sql.operators import exists
from fastapi import APIRouter, status, HTTPException
from pydantic import BaseModel #used for producing schemas
import models
from database import SessionLocal
from datetime import datetime



db = SessionLocal()

router = APIRouter(
    prefix="/requests",
    tags=["requests"],
)


@router.get("/")
async def get_all_requests():
    return db.query(models.Request).all()

class Drive(BaseModel): #serializer
    requesterId:     int
    title:           str
    endTime:         str
    actStartTime:    str
    actEndTime:      str
    reward:          str
    description:     str
    fromId:          int
    toId:            int

    class Config:
        orm_mode= True

@router.post('/drive', status_code= status.HTTP_201_CREATED)
async def create_drive(item: Drive): #接到 名稱: 型別
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    new_re = models.Request(  
        requester_id = item.requesterId,
        service_id = 1,
        description = item.description,
        start_time = now,
        end_time = item.endTime,
        act_start_time = item.actStartTime,
        act_end_time = item.actEndTime,
        reward = item.reward,
        title = item.title
    )

    db.add(new_re)
    db.commit()

    new_drive = models.DriveServicePost(
        # request_id = new_re.request_id,
        from_id = item.fromId,
        to_id = item.toId,
        re = new_re
    )

    db.add(new_drive)
    db.commit()

    return new_re.request_id


class Heavy(BaseModel): #serializer
    requesterId:     int
    title:           str
    endTime:         str
    actStartTime:    str
    actEndTime:      str
    reward:          str
    description:     str
    fromId:          int
    fromFloor:       int
    toId:            int
    toFloor:         int
    item:            str
    itemWeight:      str

    class Config:
        orm_mode= True

@router.post('/heavyLifting', status_code= status.HTTP_201_CREATED)
async def create_heavyLifting(item: Heavy): #接到 名稱: 型別
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    new_re = models.Request(  
        requester_id = item.requesterId,
        service_id = 2,
        description = item.description,
        start_time = now,
        end_time = item.endTime,
        act_start_time = item.actStartTime,
        act_end_time = item.actEndTime,
        reward = item.reward,
        title = item.title
    )

    db.add(new_re)
    db.commit()

    new_heavy = models.HeavyliftingServicePost(
        from_id = item.fromId,
        from_floor = item.fromFloor,
        to_id = item.toId,
        to_floor = item.toFloor,
        item = item.item,
        item_weight = item.itemWeight,
        re = new_re
    )

    db.add(new_heavy)
    db.commit()

    return new_re.request_id

class Kill(BaseModel): #serializer
    requesterId:     int
    title:           str
    endTime:         str
    actStartTime:    str
    actEndTime:      str
    reward:          str
    description:     str
    requesterLocationId: int

    class Config:
        orm_mode= True

@router.post('/kill', status_code= status.HTTP_201_CREATED)
async def create_kill_cockroach(item: Kill): #接到 名稱: 型別
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    new_re = models.Request(  
        requester_id = item.requesterId,
        service_id = 3,
        description = item.description,
        start_time = now,
        end_time = item.endTime,
        act_start_time = item.actStartTime,
        act_end_time = item.actEndTime,
        reward = item.reward,
        title = item.title
    )

    db.add(new_re)
    db.commit()

    new_kill = models.KillCockroachServicePost(
        requester_location_id = item.requesterLocationId,
        re = new_re
    )

    db.add(new_kill)
    db.commit()

    return new_re.request_id



class Event(BaseModel): #serializer
    requesterId:     int
    title:           str
    endTime:         str
    actStartTime:    str
    actEndTime:      str
    description:     str
    eventLocationId: int
    locationDetail:  str

    class Config:
        orm_mode= True

@router.post('/hostEvent', status_code= status.HTTP_201_CREATED)
async def create_event(item: Event): #接到 名稱: 型別
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    new_re = models.Request(  
        requester_id = item.requesterId,
        service_id = 4,
        description = item.description,
        start_time = now,
        end_time = item.endTime,
        act_start_time = item.actStartTime,
        act_end_time = item.actEndTime,
        title = item.title
    )

    db.add(new_re)
    db.commit()

    new_event = models.HostEventPost(
        event_location_id = item.eventLocationId,
        location_detail = item.locationDetail,
        re = new_re
    )

    db.add(new_event)
    db.commit()

    return new_re.request_id

# @router.get("/{request_id}")
# async def get_a_request(request_id: int):
#     return db.query(models.Request).filter(models.Request.request_id == request_id).all()

@router.get("/drive/{request_id}")
async def get_a_drive_request(request_id: int):
    q = db.query(models.DriveServicePost).filter(models.DriveServicePost.request_id == request_id)
    if q.count():
        return db.query(models.DriveServicePost, models.Request).filter(models.Request.request_id == request_id, models.DriveServicePost.request_id == request_id).all()
    else:
        raise HTTPException(status_code=404, detail="Request id not found in Drive Service Post")
    

@router.get("/heavyLifting/{request_id}")
async def get_a_heavyLifting_request(request_id: int):
    q = db.query(models.HeavyliftingServicePost).filter(models.HeavyliftingServicePost.request_id == request_id)
    if q.count():
        return db.query(models.HeavyliftingServicePost, models.Request).filter(models.Request.request_id == request_id, models.HeavyliftingServicePost.request_id == request_id).all()
    else:
        raise HTTPException(status_code=404, detail="Request id not found in Heavy lifting Service Post")

@router.get("/kill/{request_id}")
async def get_a_kill_request(request_id: int):
    q = db.query(models.KillCockroachServicePost).filter(models.KillCockroachServicePost.request_id == request_id)
    if q.count():
        return db.query(models.KillCockroachServicePost, models.Request).filter(models.Request.request_id == request_id, models.KillCockroachServicePost.request_id == request_id).all()
    else:
        raise HTTPException(status_code=404, detail="Request id not found in Kill Cockroach Service Post")

@router.get("/hostEvent/{request_id}")
async def get_a_hostEvent_request(request_id: int):
    q = db.query(models.HostEventPost).filter(models.HostEventPost.request_id == request_id)
    if q.count():
        return db.query(models.HostEventPost, models.Request).filter(models.Request.request_id == request_id, models.HostEventPost.request_id == request_id).all()
    else:
        raise HTTPException(status_code=404, detail="Request id not found in Host Event Post")

@router.get("/available")
async def get_all_available_requests():
    return db.query(models.Request).filter(models.Request.end_time >= datetime.now()).all()

@router.get("/{applier_id}")
async def get_all_requests_and_status_for_this_applier(applier_id: int):
    return db.query(models.Applier.status, models.Request).\
        join(models.Applier, models.Request.request_id == models.Applier.request_id ).\
        filter(models.Applier.applier_id == applier_id, models.Request.act_end_time >= datetime.now()).all()


class Request_Applier(BaseModel): #serializer
    requestId:      int
    applierId:      int

    class Config:
        orm_mode= True

@router.patch("/accept", status_code = status.HTTP_200_OK)
async def accept_request(item: Request_Applier):
    requestId = item.requestId
    applierId = item.applierId

    item_to_update = db.query(models.Applier).filter(models.Applier.request_id == requestId, models.Applier.applier_id == applierId)

    if item_to_update.count():
        item_to_update.first().status = 1
        db.add(item_to_update.first())
        db.commit()

        updated_item = db.query(models.Applier).filter(models.Applier.request_id == requestId, models.Applier.applier_id == applierId).first()
        return updated_item
    
    else:
        raise HTTPException(status_code=404, detail="Application data not in Appliers table")

@router.patch("/refuse", status_code = status.HTTP_200_OK)
async def refuse_request(item: Request_Applier):
    requestId = item.requestId
    applierId = item.applierId

    item_to_update = db.query(models.Applier).filter(models.Applier.request_id == requestId, models.Applier.applier_id == applierId)

    if item_to_update.count():
        item_to_update.first().status = 2
        db.add(item_to_update.first())
        db.commit()

        updated_item = db.query(models.Applier).filter(models.Applier.request_id == requestId, models.Applier.applier_id == applierId).first()
        return updated_item
    
    else:
        raise HTTPException(status_code=404, detail="Application data not in Appliers table")


@router.get("/history/{user_id}")
async def get_history_posts_of_a_user(user_id: int):
    q = db.query(models.Request).filter(models.Request.requester_id == user_id, models.Request.end_time <= datetime.now())
    if q.count():
        return q.all()
    else:
        raise HTTPException(status_code=404, detail="History request not found")

@router.get("/ongoing/{requesterId}")
async def get_ongoing_requests_of_a_user(requesterId: int):
    now = datetime.now()
    q = db.query(models.Request).filter(models.Request.requester_id == requesterId, models.Request.end_time > now)
    if q.count():
        return q.all()
    else:
        raise HTTPException(status_code=404, detail="Ongoing request not found")

class Drive_revised(BaseModel): #serializer
    requestId:       int
    title:           str
    endTime:         str
    actStartTime:    str
    actEndTime:      str
    reward:          str
    description:     str
    fromId:          int
    toId:            int

    class Config:
        orm_mode= True

@router.patch("/revise/drive/", status_code = status.HTTP_200_OK)
async def revise_drive_request(item: Drive_revised):
    requestId = item.requestId
    title = item.title
    endTime = item.endTime
    actStartTime = item.actStartTime
    actEndTime = item.actEndTime
    reward = item.reward
    description = item.description
    fromId = item.fromId
    toId = item.toId

    re_to_update = db.query(models.Request).filter(models.Request.request_id == requestId)

    if re_to_update.count():
        re_to_update.first().title = title
        re_to_update.first().end_time = endTime
        re_to_update.first().act_start_time = actStartTime
        re_to_update.first().act_end_time = actEndTime
        re_to_update.first().reward = reward
        re_to_update.first().description = description

        db.add(re_to_update.first())
        db.commit()

        dr_to_update = db.query(models.DriveServicePost).filter(models.DriveServicePost.request_id == requestId)
        dr_to_update.first().from_id = fromId
        dr_to_update.first().to_id = toId

        db.add(dr_to_update.first())
        db.commit()

        return
    
    else:
        raise HTTPException(status_code=404, detail="Request Not Found.")


class Heavy_revised(BaseModel): #serializer
    requestId:       int
    title:           str
    endTime:         str
    actStartTime:    str
    actEndTime:      str
    reward:          str
    description:     str
    fromId:          int
    fromFloor:       int
    toId:            int
    toFloor:         int
    item:            str
    itemWeight:      str

    class Config:
        orm_mode= True

@router.patch("/revise/heavyLifting/", status_code = status.HTTP_200_OK)
async def revise_drive_request(item: Heavy_revised):
    requestId = item.requestId
    title = item.title
    endTime = item.endTime
    actStartTime = item.actStartTime
    actEndTime = item.actEndTime
    reward = item.reward
    description = item.description
    fromId = item.fromId
    fromFloor = item.fromFloor
    toId = item.toId
    toFloor = item.toFloor
    itemN = item.item
    itemWeight = item.itemWeight


    re_to_update = db.query(models.Request).filter(models.Request.request_id == requestId)

    if re_to_update.count():
        re_to_update.first().title = title
        re_to_update.first().end_time = endTime
        re_to_update.first().act_start_time = actStartTime
        re_to_update.first().act_end_time = actEndTime
        re_to_update.first().reward = reward
        re_to_update.first().description = description

        db.add(re_to_update.first())
        db.commit()

        hy_to_update = db.query(models.HeavyliftingServicePost).filter(models.HeavyliftingServicePost.request_id == requestId)
        hy_to_update.first().from_id = fromId
        hy_to_update.first().from_floor = fromFloor
        hy_to_update.first().to_id = toId
        hy_to_update.first().to_floor = toFloor
        hy_to_update.first().item = itemN
        hy_to_update.first().item_weight = itemWeight

        db.add(hy_to_update.first())
        db.commit()

        return
    
    else:
        raise HTTPException(status_code=404, detail="Request Not Found.")

class Kill_revised(BaseModel): #serializer
    requestId:       int
    title:           str
    endTime:         str
    actStartTime:    str
    actEndTime:      str
    reward:          str
    description:     str
    requesterLocationId:   int

    class Config:
        orm_mode= True

@router.patch("/revise/kill/", status_code = status.HTTP_200_OK)
async def revise_kill_cockroach_request(item: Kill_revised):
    requestId = item.requestId
    title = item.title
    endTime = item.endTime
    actStartTime = item.actStartTime
    actEndTime = item.actEndTime
    reward = item.reward
    description = item.description
    requesterLocationId = item.requesterLocationId

    re_to_update = db.query(models.Request).filter(models.Request.request_id == requestId)

    if re_to_update.count():
        re_to_update.first().title = title
        re_to_update.first().end_time = endTime
        re_to_update.first().act_start_time = actStartTime
        re_to_update.first().act_end_time = actEndTime
        re_to_update.first().reward = reward
        re_to_update.first().description = description

        db.add(re_to_update.first())
        db.commit()

        ki_to_update = db.query(models.KillCockroachServicePost).filter(models.KillCockroachServicePost.request_id == requestId)
        ki_to_update.first().requester_location_id = requesterLocationId

        db.add(ki_to_update.first())
        db.commit()

        return
    
    else:
        raise HTTPException(status_code=404, detail="Request Not Found.")


class Event_revised(BaseModel): #serializer
    requestId:       int
    title:           str
    endTime:         str
    actStartTime:    str
    actEndTime:      str
    description:     str
    eventLocationId: int
    locationDetail:  str  

    class Config:
        orm_mode= True

@router.patch("/revise/hostEvent/", status_code = status.HTTP_200_OK)
async def revise_event_request(item: Event_revised):
    requestId = item.requestId
    title = item.title
    endTime = item.endTime
    actStartTime = item.actStartTime
    actEndTime = item.actEndTime
    description = item.description
    eventLocationId = item.eventLocationId
    locationDetail = item.locationDetail

    re_to_update = db.query(models.Request).filter(models.Request.request_id == requestId)

    if re_to_update.count():
        re_to_update.first().title = title
        re_to_update.first().end_time = endTime
        re_to_update.first().act_start_time = actStartTime
        re_to_update.first().act_end_time = actEndTime
        re_to_update.first().description = description

        db.add(re_to_update.first())
        db.commit()

        ev_to_update = db.query(models.HostEventPost).filter(models.HostEventPost.request_id == requestId)
        ev_to_update.first().event_location_id = eventLocationId
        ev_to_update.first().location_detail = locationDetail

        db.add(ev_to_update.first())
        db.commit()

        return
    
    else:
        raise HTTPException(status_code=404, detail="Request Not Found.")


@router.patch("/stop/{request_id}", status_code = status.HTTP_200_OK)
async def stop_request(request_id: int):
    re_to_update = db.query(models.Request).filter(models.Request.request_id == request_id)

    if re_to_update.count():
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        re_to_update.first().end_time = now
        db.add(re_to_update.first())
        db.commit()
        return
    else:
        raise HTTPException(status_code=404, detail="Request Not Found.")
