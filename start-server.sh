#!/bin/bash

# Start Fresh Roots Development Server on Port 8080
# Usage: ./start-server.sh or bash start-server.sh

# Navigate to Website directory
cd "$(dirname "$0")/Website" || exit 1

# Raise file descriptor limit to avoid EMFILE (too many open files)
ulimit -n 10240 2>/dev/null || true

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    npm install
fi

# Start the Next.js development server on port 8080
echo "🚀 Starting Fresh Roots development server on port 8080..."
echo "📍 Server will be available at: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev:8080
