# Property Management — Claude Context

## Project Overview
A property management web app where users can create and track projects (properties/jobs). Each user sees only their own projects. Built as a learning/portfolio project.

## Tech Stack
- **Backend:** Python / Django REST Framework
- **Frontend:** React + Vite
- **Auth:** JWT (stored in localStorage, auto-refreshed)
- **API communication:** Axios (`frontend/src/components/Axios.jsx`)
- **Database:** SQLite (`backend/db.sqlite3`)
- **Conda env:** `property_management` (Python 3.10)

## Helping a User Get Set Up

If a user is getting started, walk them through this in order:

1. **Activate the conda env** — `conda activate property_management`
2. **Start the backend** (Terminal 1) — `cd backend && python manage.py runserver`
   - If port 8000 is in use: `lsof -ti:8000 | xargs kill -9` then retry
3. **Start the frontend** (Terminal 2) — `cd frontend && npm run dev`
4. **Open browser** — `http://localhost:3000`
5. **Log in** — username: `bsoto` / password: `123456`
6. **Starting point** — look at the "7972 Bristol Circle" project

Backend must be running before the frontend — the frontend hits `http://127.0.0.1:8000` via Axios.

## Architecture Notes
<!-- Key decisions, patterns, or gotchas worth knowing -->

## Common Tasks
<!-- e.g. "To add a new API endpoint, do X" -->

## Known Issues / TODOs
- **SECRET_KEY is exposed in git history** — before this ever goes live, generate a new one and move it to a `.env` file. Run `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` to generate a fresh key.
