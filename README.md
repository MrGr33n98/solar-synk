# Databutton app

This project consists of a FastAPI backend server and a React + TypeScript frontend application exported from Databutton.

## Stack

- React + TypeScript frontend built with Vite.
- Python FastAPI server with `uv` as package manager.

## Quickstart

1. Install dependencies:

```bash
make
```

On Windows use the provided batch scripts instead of `make`:

```cmd
backend\install.bat
frontend\install.bat
```

2. Copy the provided `.env.example` to `.env` and adjust the values as needed:

```bash
cp backend/.env.example backend/.env
```

3. Start a local PostgreSQL instance using Docker:

```bash
docker run --name solar_sync_db -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=solar_sync_db \
  -p 5432:5432 -d postgres:15
```

4. Run the SQL migrations in order:

```bash
psql "$DATABASE_URL" -f backend/migrations/001_admin_panel.sql
psql "$DATABASE_URL" -f backend/migrations/002_leads_system.sql
```

5. Start the backend and frontend servers in separate terminals:

```bash
make run-backend
make run-frontend
```

### Dependency versions

The backend uses `backend/requirements.txt` as the authoritative list of
package versions. `backend/pyproject.toml` mirrors those pins for convenience
but the `requirements.txt` file is used when installing.

## Gotchas

The backend server runs on port 8000 and the frontend development server runs on port 5173. The frontend Vite server proxies API requests to the backend on port 8000.


Visit <http://localhost:5173> to view the application during development.

## Production build

To build the frontend for production run:

```bash
npm run build
```

The generated files will be available in `frontend/dist`. Serve this directory
with any static HTTP server (for example Nginx) while running the FastAPI
backend.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
