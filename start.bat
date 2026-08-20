@echo off
echo Starting Inventory Management Tool...

echo Starting backend...
start "Backend" cmd /k "cd backend && npm i && npm start"

echo Starting frontend...
start "Frontend" cmd /k "cd frontend && npm i && npm run dev"

echo Both servers are starting in separate windows.
echo Close those windows to stop the servers.

