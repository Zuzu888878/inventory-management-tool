@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed.
  echo Install Node.js 22 or newer from https://nodejs.org/en/download/ and run start.bat again.
  pause
  exit /b 1
)
for /f "tokens=1 delims=.v" %%V in ('node -p "process.versions.node"') do set NODE_MAJOR=%%V
if %NODE_MAJOR% LSS 22 (
  echo ERROR: Node.js 22 or newer is required. Found:
  node --version
  echo Install the current LTS release from https://nodejs.org/en/download/ and run start.bat again.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm is missing. Reinstall Node.js 22 or newer from https://nodejs.org/en/download/.
  pause
  exit /b 1
)
echo Node.js and npm found.

if not exist "backend\.env" (
  copy "backend\.env.example" "backend\.env" >nul
  echo Created backend\.env from the example.
  echo Edit it with your PostgreSQL credentials and a secure APP_PASSWORD, then run start.bat again.
  pause
  exit /b 1
)

echo.
echo Installing backend dependencies...
pushd backend
call npm ci
if errorlevel 1 goto :dependency_error
popd
echo Installing frontend dependencies...
pushd frontend
call npm ci
if errorlevel 1 goto :dependency_error
popd

echo.
echo Reset the configured database and reseed all data?
echo WARNING: This permanently deletes all data in the configured database.
choice /C YN /N /M "Choose Y to reset and reseed, or N to keep the existing database [Y/N]: "
set RESET_DATABASE=%errorlevel%
pushd backend
if "%RESET_DATABASE%"=="1" (
  echo Recreating database and seeding admin plus demo data...
  call npm run db:reset
  if errorlevel 1 goto :reset_error
) else (
  echo Keeping the existing database. Checking PostgreSQL connection...
  call npm run db:check
  if errorlevel 1 goto :database_error
)
echo Initializing database schema...
call npm run db:init
if errorlevel 1 goto :schema_error
if "%RESET_DATABASE%"=="1" (
  echo Seeding administrator and demo data...
  call npm run db:seed
  if errorlevel 1 goto :seed_error
) else (
  echo Keeping existing database data. No seed commands will run.
)
popd

echo.
echo Starting backend and frontend in separate windows...
start "Inventory Backend" /D "%~dp0backend" cmd /k "npm start"
start "Inventory Frontend" /D "%~dp0frontend" cmd /k "npm run dev -- --host 127.0.0.1"
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000
echo Close both server windows to stop the application.
exit /b 0

:dependency_error
popd
echo ERROR: Dependency installation failed. Check your network access and npm output, then retry.
pause
exit /b 1

:database_error
popd
echo ERROR: PostgreSQL is not ready. Install/start PostgreSQL from https://www.postgresql.org/download/, create the configured database, and check backend\.env.
pause
exit /b 1

:reset_error
popd
echo ERROR: Database reset failed. Check PostgreSQL create/drop permissions and DB_MAINTENANCE_NAME in backend\.env.
pause
exit /b 1

:schema_error
popd
echo ERROR: Database initialization failed. Check PostgreSQL permissions and backend\.env.
pause
exit /b 1

:seed_error
popd
echo ERROR: Data seeding failed. Check APP_USERNAME and APP_PASSWORD in backend\.env, then retry.
pause
exit /b 1

