#!/bin/bash

# Create logs directory if it doesn't exist
mkdir -p logs

# Get current timestamp for log file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="logs/manual-test-${TIMESTAMP}.log"

echo "Starting TopSmile Backend with logging..."
echo "Log file: ${LOG_FILE}"
echo "Press Ctrl+C to stop"
echo ""

# Start the backend and pipe output to both console and log file
npm run dev 2>&1 | tee "${LOG_FILE}"
