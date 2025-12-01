import logging
from fastapi import FastAPI
from .routers import rooms, ws
from .database import Base, engine
from . import models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app")

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(rooms.router)
app.include_router(ws.router)


@app.get("/")
def health():
    logger.info("App root endpoint called")
    return {"status": "Starting application & initializing DB"} 