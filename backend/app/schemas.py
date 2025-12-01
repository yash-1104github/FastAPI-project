from pydantic import BaseModel
from typing import Optional

class RoomCreateResponse(BaseModel):
    roomId: str

class AutocompleteRequest(BaseModel):
    code: str
    cursorPosition: int
    language: str = "python"

class AutocompleteResponse(BaseModel):
    suggestion: str 

class CodeRequest(BaseModel):
    language_id: int
    source_code: str
    stdin: str