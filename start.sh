#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

fail() {
  printf '\nSetup stopped: %s\n' "$1" >&2
  exit 1
}

if ! command -v node >/dev/null 2>&1; then
  fail "Node.js is not installed. Install Node.js 22 or newer from https://nodejs.org/en/download/, then run ./start.sh again."
fi
NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
if [ "$NODE_MAJOR" -lt 22 ]; then
  fail "Node.js $(node --version) is too old. Install Node.js 22 or newer from https://nodejs.org/en/download/, then run ./start.sh again."
fi
if ! command -v npm >/dev/null 2>&1; then
  fail "npm is not available. Reinstall Node.js 22 or newer from https://nodejs.org/en/download/ (npm is included), then run ./start.sh again."
fi

printf 'Node.js %s and npm %s found.\n' "$(node --version)" "$(npm --version)"

if [ ! -f "$BACKEND_DIR/.env" ]; then
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
  printf '\nCreated backend/.env from the example. Edit it with your PostgreSQL credentials and a secure APP_PASSWORD, then run ./start.sh again.\n'
  exit 1
fi

printf '\nInstalling backend dependencies...\n'
(cd "$BACKEND_DIR" && npm ci) || fail "Backend dependency installation failed. Check your network access and npm output, then retry."
printf '\nInstalling frontend dependencies...\n'
(cd "$FRONTEND_DIR" && npm ci) || fail "Frontend dependency installation failed. Check your network access and npm output, then retry."

printf '\nReset the database configured in backend/.env and reseed all data? This permanently deletes all data in that database. [y/N] '
if ! read -r RESET_DATABASE; then
  RESET_DATABASE=""
fi
case "$RESET_DATABASE" in
  y|Y|yes|YES|Yes)
    printf '\nRecreating database and seeding admin plus demo data...\n'
    (cd "$BACKEND_DIR" && npm run db:reset) || fail "Database reset failed. Check the PostgreSQL create/drop permissions and backend/.env settings."
    RESET_DATABASE=true
    ;;
  *)
    printf '\nKeeping the existing database. Checking PostgreSQL connection...\n'
    (cd "$BACKEND_DIR" && npm run db:check) || fail "PostgreSQL is not ready. Follow the database instructions above, update backend/.env if needed, and run ./start.sh again."
    RESET_DATABASE=false
    ;;
esac
printf '\nInitializing database schema...\n'
(cd "$BACKEND_DIR" && npm run db:init) || fail "Database initialization failed. Check the PostgreSQL user permissions and backend/.env settings."
if [ "$RESET_DATABASE" = true ]; then
  printf '\nSeeding administrator and demo data...\n'
  (cd "$BACKEND_DIR" && npm run db:seed) || fail "Data seeding failed. Check APP_USERNAME and APP_PASSWORD in backend/.env, then retry."
else
  printf '\nKeeping existing database data; no seed commands will run.\n'
fi

printf '\nStarting backend and frontend...\n'
(cd "$BACKEND_DIR" && npm start) &
BACKEND_PID=$!
(cd "$FRONTEND_DIR" && npm run dev -- --host 127.0.0.1) &
FRONTEND_PID=$!

stop_servers() {
  printf '\nStopping servers...\n'
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}
trap stop_servers EXIT INT TERM

printf '\nFrontend: http://localhost:5173\nBackend:  http://localhost:3000\nPress Ctrl+C to stop both servers.\n'
wait
