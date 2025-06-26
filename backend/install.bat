@echo off
echo Removing existing virtual environment...
if exist .venv rmdir /s /q .venv

echo Creating virtual environment...
python -m venv .venv
call .venv\Scripts\activate

echo Updating pip and installing basic tools...
python -m pip install --upgrade pip wheel setuptools

echo Installing pre-built wheels...
pip install --only-binary :all: -r requirements.txt

echo Testing installation...
python -c "import fastapi; print(f'FastAPI {fastapi.__version__} installed successfully!')"
python -c "import psycopg2; print('Database driver installed successfully!')"

pause

echo Installing dependencies one by one...
pip install fastapi==0.104.1
pip install "uvicorn[standard]==0.24.0"
pip install python-multipart==0.0.6
pip install asyncpg==0.29.0
pip install pydantic==2.3.0
pip install email-validator==2.0.0
pip install "python-jose[cryptography]==3.3.0"
pip install "passlib[bcrypt]==1.7.4"
pip install sqlalchemy==2.0.23
pip install python-dotenv==1.0.0
pip install requests==2.31.0
pip install beautifulsoup4==4.12.2
pip install PyJWT==2.8.0

echo Installation completed!
echo Testing FastAPI installation...
python -c "import fastapi; print(f'FastAPI {fastapi.__version__} installed successfully!')"

pause
