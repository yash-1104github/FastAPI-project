## How to run 

1. **Postgres:** Create a postgress database named `pairprog_db`.
```bash
psql -U postgres -d pairprog_db
```

2. **Backend:**

```bash
cd code_buddy/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

3. **Frontend:**

```bash
cd code_buddy/frontend
npm install
npm run dev
```

## Technology & Design Choices

1. **Backend**
- Built with FastAPI for async performance and native WebSocket support
- Code execution is handled using Judge0 API for secure compilation
- A WebSocket Room Manager maintains multiple connections per room and broadcasts code/output updates

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
