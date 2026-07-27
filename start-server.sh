#!/bin/bash

# Start Fresh Roots Development Server on Port 8080
# Usage: ./start-server.sh or bash start-server.sh

set -e

# Navigate to Website directory
cd "$(dirname "$0")/Website" || exit 1

# Raise file descriptor limit to avoid EMFILE (too many open files)
ulimit -n 10240 2>/dev/null || true

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    npm install
fi

PORT=8080

# If something is already listening on 8080, it may be a stuck Next from a prior run
# (listens but never reaches Ready / never serves HTTP). Clear it before starting.
EXISTING_PIDS=$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)
if [ -n "$EXISTING_PIDS" ]; then
  echo "⚠️  Port $PORT is already in use (PIDs: $EXISTING_PIDS)."
  echo "   Stopping stuck process(es) so Next can start cleanly..."
  # shellcheck disable=SC2086
  kill $EXISTING_PIDS 2>/dev/null || true
  sleep 1
  STILL=$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)
  if [ -n "$STILL" ]; then
    # shellcheck disable=SC2086
    kill -9 $STILL 2>/dev/null || true
    sleep 1
  fi
fi

# Start the Next.js development server on port 8080
echo "🚀 Starting Fresh Roots development server on port $PORT..."
echo "📍 Open: http://127.0.0.1:$PORT"
echo "📍 SOW:  http://127.0.0.1:$PORT/sow/deer-connection-phase-one"
echo ""
echo "Wait until you see \"✓ Ready\" before opening the browser."
echo "Tip: open the SOW URL directly (skip the homepage) for a lighter first compile."
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev:8080
