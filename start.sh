#!/bin/bash

echo "Starting Inventory Management Tool..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && npm i

# Start backend
echo "Starting backend..."
npm start &
BACKEND_PID=$!

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend && npm i

# Start frontend
echo "Starting frontend..."
npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both servers."

# Wait and handle shutdown
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

wait


