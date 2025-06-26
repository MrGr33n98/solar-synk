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

The leads API can optionally send email notifications when a new lead is
created. Configure your SMTP credentials in the `.env` file using the
variables below:

```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your_username
SMTP_PASSWORD=your_password
EMAIL_FROM=no-reply@example.com
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
./run_backend.sh        # Linux/macOS
run_backend.bat         # Windows
```


## Running tests

After installing dependencies, run the automated test suite with `pytest`:

```bash
pytest
```

The tests use an in-memory database and do not require a running PostgreSQL server.
