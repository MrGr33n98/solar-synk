install-backend:
        chmod +x backend/install.sh
        chmod +x backend/run_backend.sh
        cd backend && ./install.sh

install-frontend:
	chmod +x frontend/install.sh
	chmod +x frontend/run.sh
	cd frontend && ./install.sh

install: install-backend install-frontend

run-backend:
        cd backend && ./run_backend.sh

run-frontend:
	cd frontend && ./run.sh

.DEFAULT_GOAL := install
