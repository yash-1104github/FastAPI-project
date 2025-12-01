import logging
import os
import base64
import http.client
import json
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import getDb
from ..services import room_service
from ..schemas import RoomCreateResponse, AutocompleteRequest, AutocompleteResponse , CodeRequest
from fastapi.responses import JSONResponse

router = APIRouter()
load_dotenv()

api_key = os.getenv("RAPID_API_KEY")
logging.info(api_key)

@router.post("/rooms", response_model=RoomCreateResponse)
def createRoom(db: Session = Depends(getDb)):
    try:
        room_id = room_service.createRoom(db)
        logging.info("Room created")
        return {"roomId": room_id}
    except Exception as e:
        logging.info("Room creation failed")
        raise HTTPException(status_code=500, detail="Failed to create room")
   
@router.post("/autocomplete", response_model=AutocompleteResponse) 
def autoComplete(req: AutocompleteRequest):
    code = req.code
    pos = req.cursorPosition

    prefix = code[0:pos]
    suggestion = ""
    language = req.language.lower()

    if code.rstrip().endswith("#") and language == "python":
        suggestion = "import sys\n"

    elif "def main" in code and language == "python":
        suggestion = (
            "def main():\n"
            "    print(\"Hello World\")\n\n"
            "if __name__ == '__main__':\n"
            "    main()\n"
        )

    elif code.rstrip().endswith("for") and language == "python":
        suggestion = (
            "for i in range(n):\n"
            "    # TODO\n"
            "    pass\n"
        )

    elif "print(" in code and language == "python":
        suggestion = "print(\"Hello World\")"

    elif "sys." in code and language == "python":
        suggestion = "sys.exit()\n"

    else:
        suggestion = "Tip: Try creating a helper function"

    return {"suggestion": suggestion}

def runCode(sourceCode: str, input_data: str, language_id: int):
    conn = http.client.HTTPSConnection("judge0-ce.p.rapidapi.com")

    payload = json.dumps({
        "language_id": language_id,
        "source_code": sourceCode,
        "stdin": input_data
    })

    headers = {
        'x-rapidapi-key': api_key,
        'x-rapidapi-host': "judge0-ce.p.rapidapi.com",
        'Content-Type': "application/json"
    }

    conn.request("POST", "/submissions?base64_encoded=true&wait=true&fields=stdout,stderr,compile_output,message,status", payload, headers)
    
    res = conn.getresponse()
    data = res.read()
    conn.close()

    return json.loads(data.decode())

@router.post("/run")
async def compile_and_run(req: CodeRequest):
    try :
          result = runCode(req.source_code, req.stdin, req.language_id)
          logging.info(result)
          return JSONResponse(result)
    except Exception as e:
        return JSONResponse({ "error": str(e) }, status_code=500)
