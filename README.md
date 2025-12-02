## How to run 

1. **Postgres:** Create a postgress database named `pairprog_db`.
```bash
psql -U postgres -d pairprog_db
```

2. **Backend:**

```bash
mkdir FastAPI-project/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Create env file inside backend folder 
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pairprog_db"
RAPID_API_KEY="005d9ffa4bmsh4d534f6fa2e852bp1238b5jsn444c38d5b2c5"
FRONTEND_URL="http://localhost:3000"
```

3. **Frontend:**

```bash
cd FastAPI-project/frontend
npm install
npm run dev
```

Create env file inside frontend folder 
```bash
VITE_API_URL="http://localhost:8000"
```

## Technology & Design Choices

1. **Backend**
- Built with FastAPI for async performance and native WebSocket support
- Code execution is handled using Judge0 API for secure compilation
- A WebSocket Room Manager maintains multiple connections per room and broadcasts code/output 


2. **Frontend**
- Built using React + TypeScript for clean scaling and type safety
- Redux store manages shared editor state to avoid prop drilling
- Custom debounce hook limits API calls for autocomplete (600ms) and websocket updates
- Vite proxy routes API requests (/run, /rooms, /autocomplete) and WS (/ws) to backend, enabling clean URL usage without CORS errors

## What Would Be Improved with More Time
- Replace <textarea> with Monaco Editor for IDE style experience
- Show inline AI suggestions
- Add JWT auth for private & secure rooms
- Add Redis caching + rate limits for AI autocomplete

## Any limitations
- Autocomplete works via API but it's not inline ghost-text like Copilot
- Rooms are public — no authentication or access control yet

## Demo
<img width="1694" height="956" alt="Screenshot 2025-12-01 at 4 23 47 PM" src="https://github.com/user-attachments/assets/c9154aa9-8ffb-40ca-8086-2cb691aaf62d" />
<img width="1675" height="941" alt="Screenshot 2025-12-01 at 3 09 30 PM" src="https://github.com/user-attachments/assets/7a40ea46-2329-4a0a-8bb5-6850cc41f6fb" />
