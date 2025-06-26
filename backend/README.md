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

Copy `.env.example` to `.env` in this folder and edit the values. The main
variable required is `DATABASE_URL`:

```bash
cp .env.example .env
```

For example:

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

