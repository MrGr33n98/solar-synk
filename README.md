# Databutton app

This project consists of a FastAPI backend server and a React + TypeScript frontend application exported from Databutton.

## Stack

- React + TypeScript frontend with Yarn 4 and Plug'n'Play (`nodeLinker: pnpm`).
- Python FastAPI server with `uv` as package manager.

## Quickstart

1. Enable Yarn 4:

```bash
corepack enable
yarn set version 4.0.2
```

2. Install dependencies:

```bash
make
```

On Windows use the provided batch scripts instead of `make`:

```cmd
backend\install.bat
frontend\install.bat
```

3. Create a `.env` file inside `backend/` and set your database connection and
other environment variables:

```bash
echo DATABASE_URL=postgresql://user:password@localhost/solarsync > backend/.env
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
yarn build
```

The generated files will be available in `frontend/dist`. Serve this directory
with any static HTTP server (for example Nginx) while running the FastAPI
backend.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
