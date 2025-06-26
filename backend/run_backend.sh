#!/bin/bash

# Load environment variables if .env exists
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Activate virtual environment if present
if [ -f .venv/bin/activate ]; then
  source .venv/bin/activate
fi

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
