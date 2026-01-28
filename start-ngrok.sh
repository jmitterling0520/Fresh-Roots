#!/bin/bash

# Start Ngrok Tunnel for Fresh Roots Development Server
# This script starts ngrok to expose your local server on port 8080
# Usage: ./start-ngrok.sh

echo "🌐 Starting Ngrok tunnel for Fresh Roots..."
echo "📍 Local server should be running on port 8080"
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ Error: ngrok is not installed!"
    echo ""
    echo "Install ngrok using one of these methods:"
    echo "  brew install ngrok/ngrok/ngrok"
    echo "  or visit: https://ngrok.com/download"
    echo ""
    echo "Then configure your authtoken:"
    echo "  ngrok config add-authtoken YOUR_TOKEN"
    echo "  (Get token from: https://dashboard.ngrok.com/get-started/your-authtoken)"
    exit 1
fi

# Check if local server is running on port 8080
if ! lsof -i :8080 &> /dev/null; then
    echo "⚠️  Warning: No server detected on port 8080"
    echo ""
    echo "Make sure your development server is running first:"
    echo "  cd '$PWD' && ./start-server.sh"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🚀 Starting ngrok tunnel..."
echo "📊 Ngrok web interface will be available at: http://127.0.0.1:4040"
echo "🛑 Press Ctrl+C to stop ngrok"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start ngrok
ngrok http 8080
