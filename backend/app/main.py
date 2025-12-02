import logging
from dotenv import load_dotenv
import os
from fastapi import FastAPI

from .routers import rooms, ws
from .database import Base, engine
from . import models
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app")

Base.metadata.create_all(bind=engine)

app = FastAPI()

FRONTEND_URL = os.getenv("FRONTEND_URL")

origins = [
    FRONTEND_URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rooms.router)
app.include_router(ws.router)

@app.get("/")
def health():
    logger.info("App root endpoint called")
    return {"status": "Starting application & initializing DB"} 