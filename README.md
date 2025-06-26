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

3. Start the backend and frontend servers in separate terminals:

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

Visit <http://localhost:5173> to view the application.
