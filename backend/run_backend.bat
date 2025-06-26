@echo off
if exist .env (
  for /f "usebackq tokens=1,* delims==" %%i in (.env) do set %%i=%%j
)
if exist .venv\Scripts\activate (
  call .venv\Scripts\activate
)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
