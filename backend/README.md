# Backend setup

This directory contains the FastAPI application. The steps below describe how to
set it up locally.

## Installing dependencies

### Linux/macOS

```bash
./install.sh
```

### Windows

Run the bundled batch script:

```cmd
install.bat
```

## Environment variables

Create a `.env` file in this folder with your database connection string and any
other variables required by the application. The most important one is
`DATABASE_URL`:

```bash
DATABASE_URL=postgresql://user:password@localhost/solarsync
```

## Running migrations

Apply the SQL files in `migrations/` to your database using `psql`:

```bash
psql "$DATABASE_URL" -f migrations/001_admin_panel.sql
psql "$DATABASE_URL" -f migrations/002_leads_system.sql
```

## Starting the server

Use the provided scripts to run the development server:

```bash
./run.sh        # Linux/macOS
run.bat         # Windows
```

