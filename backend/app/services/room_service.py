import logging
import uuid
from sqlalchemy.orm import Session
from .. import models

def createRoom(db: Session) -> str:
    room_id = str(uuid.uuid4())[:8]
    room = models.Room(id=room_id, code="")
    db.add(room)
    db.commit()
    logging.info("New Room added")
    return room_id

def getCode(db: Session, room_id: str) -> str:
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if room is not None:
        logging.info("room found")
        return room.code
    else:
        logging.info("room not found")
        return ""

def updateCode(db: Session, room_id: str, code: str):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if room:
        room.code = code
        logging.info("code Updated")
    else:
        room = models.Room(id=room_id, code=code)
        db.add(room)
    db.commit()