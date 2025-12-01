import logging
import json
from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from ..services import room_service
from ..database import getDb

router = APIRouter()

class ConnectionManager: 
    def __init__(self):
        self.active: Dict[str, List[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        userList = self.active.get(room_id, [])
        userList.append(websocket) 
        self.active[room_id] = userList
        logging.info("User joined room")

    def disconnect(self, room_id: str, websocket: WebSocket):
        userList = self.active.get(room_id, [])
        if websocket in userList:
            userList.remove(websocket)
            logging.info("User left room")
        if len(userList) == 0:
            self.active.pop(room_id, None)
            logging.info("Room removed from memory")

    async def broadcast(self, room_id: str, message: str):
        userList = self.active.get(room_id, [])
        for user in userList:
            try:
                await user.send_text(message)
            except Exception:
                pass  

manager = ConnectionManager() 

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, db: Session = Depends(getDb)):

    await manager.connect(room_id, websocket)

    currentCode = room_service.getCode(db, room_id)
    initMessage = json.dumps({"type": "init", "code": currentCode})
    await websocket.send_text(initMessage)

    try:
        while True:
            newMessage = await websocket.receive_text()
            data_json = ""
            try:
                data_json = json.loads(newMessage)
            except Exception:          
                continue

            if data_json.get("type") == "code":
                newCode = data_json.get("code")
                room_service.updateCode(db, room_id, newCode)
                logging.info("Code updated in DB for room") 
                broadcastMessage = json.dumps({"type": "code", "code": newCode})
                await manager.broadcast(room_id, broadcastMessage)

    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)  