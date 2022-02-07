from fastapi import FastAPI, status, HTTPException
from pydantic import BaseModel #used for producing schemas
from typing import Optional, List

from starlette.status import HTTP_200_OK
from database import SessionLocal
import models
import users, services, requests, locations, appliers
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(users.router)
app.include_router(services.router)
app.include_router(requests.router)
app.include_router(appliers.router)
app.include_router(locations.router)
origins = [
    "http://localhost:3000",
    "http://localhost"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)
class Item(BaseModel): #serializer
    id: int
    name: str
    description: str
    price: int
    on_offer: bool

    class Config:
        orm_mode= True


db = SessionLocal()

@app.get("/")
async def root():
    return {"message": "Hello Router"}
@app.get('/items', response_model= List[Item], status_code=200)
def get_all_items():
    items = db.query(models.Item).all()

    return items

@app.get('/item/{item_id}', response_model=Item, status_code=HTTP_200_OK)
def get_an_item(item_id: int):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()

    return item

@app.post('/items', response_model=Item, 
        status_code= status.HTTP_201_CREATED)
def create_an_item(item: Item):
    new_item = models.Item(
        name = item.name,
        price = item.price,
        description = item.description,
        on_offer = item.on_offer
    )
    
    db_name_exist = db.query(models.Item).filter(new_item.name == models.Item.name).first()
    if db_name_exist is not None:
        raise HTTPException(status_code=400, detail="Item already exists")
    else:
        db.add(new_item)
        db.commit()

    return new_item

@app.put('/item/{item_id}', response_model=Item, status_code=status.HTTP_200_OK)
def update_an_item(item_id: int, item: Item):
    item_to_update = db.query(models.Item).filter(models.Item.id == item_id).first()
    item_to_update.name = item.name
    item_to_update.price = item.price
    item_to_update.description = item.description
    item_to_update.on_offer = item.on_offer

    db.commit()
    return item_to_update


@app.delete('/item/{item_id}')
def delete_item(item_id: int):
    item_to_delete = db.query(models.Item).filter(models.Item.id == item_id).first()

    if item_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource Not Found")
    else:
        db.delete(item_to_delete)
        db.commit()
        return "item is deleted successfully"