#!/bin/bash

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null
then
    echo "ngrok is not installed. Please install it first:"
    echo "- For macOS (Homebrew): brew install ngrok"
    echo "- For other platforms, visit https://ngrok.com/download"
    exit 1
fi

# Check if .env file exists and load environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Start the NestJS application in the background
npm run start:dev &
APP_PID=$!

# Wait a moment for the app to start
sleep 5

# Start ngrok tunnel
echo "Starting ngrok tunnel..."
ngrok http 3000 --log=stdout > ngrok.log &
NGROK_PID=$!

# Wait for ngrok to generate the public URL
sleep 5

# Extract the ngrok URL
NGROK_URL=$(grep -o 'https://[0-9a-z]*\.ngrok\.io' ngrok.log | head -n 1)

if [ -z "$NGROK_URL" ]; then
    echo "Failed to get ngrok URL"
    kill $APP_PID
    kill $NGROK_PID
    exit 1
fi

echo "🌐 Application is live at: $NGROK_URL"
echo "🔗 Local URL: http://localhost:3000"

# Trap to ensure cleanup on exit
trap 'kill $APP_PID $NGROK_PID' SIGINT SIGTERM EXIT

# Wait for user to terminate
read -p "Press [Enter] to stop the tunnel and application..."
