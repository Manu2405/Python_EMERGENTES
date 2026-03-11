# Contactos App (React + Tailwind, FastAPI + PostgreSQL)

Aplicación de gestión de contactos con frontend (React + Tailwind) y backend (FastAPI + SQLAlchemy + PostgreSQL).

## Estructura
- `frontend/` - aplicación React + Tailwind.
- `backend/` - API FastAPI con PostgreSQL y UUID.
- `Manual_tecnico.md` - documentación de entregables.

## Cómo iniciar
### Backend
1. Crear y activar virtualenv:
   - `python -m venv venv`
   - `venv\Scripts\activate` (Windows)
2. Instalar dependencias:
   - `pip install -r backend/requirements.txt`
3. Configurar Base de datos en `backend/.env`.
4. Ejecutar:
   - `uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## API
- `GET /api/groups`
- `POST /api/groups`
- `PUT /api/groups/{id}`
- `GET /api/persons`
- `POST /api/persons`
- `PUT /api/persons/{id}`

## Notas
- La relación es `Group (1) -> Person (n)`.
- `code` es UUID en todas las entidades.
