from pydantic import BaseModel
from fastapi import FastAPI

class User(BaseModel):
    userName: str
    password: str
    gender: str
    phoneNum: str
    fbUrl: str
    dormID: int

    class Config:
        orm_mode= True