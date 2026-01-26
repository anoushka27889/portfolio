#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🔍 Starting Next.js Dev Server with Monitoring${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Set environment variables for better debugging
export DEBUG=1
export NEXT_TELEMETRY_DISABLED=1

# Function to monitor file changes
monitor_files() {
  echo -e "${YELLOW}📁 Monitoring file changes...${NC}"
  fswatch -0 -e ".*" -i "\\.tsx?$" -i "\\.css$" app/ components/ lib/ | while read -d "" event
  do
    echo -e "${GREEN}[FILE CHANGED]${NC} $(date '+%H:%M:%S') - ${event}"
  done &
  FSWATCH_PID=$!
}

# Function to monitor memory
monitor_memory() {
  echo -e "${YELLOW}💾 Monitoring memory usage...${NC}"
  while true; do
    sleep 10
    NODE_MEMORY=$(ps aux | grep 'next dev' | grep -v grep | awk '{print $6}')
    if [ ! -z "$NODE_MEMORY" ]; then
      MEMORY_MB=$((NODE_MEMORY / 1024))
      echo -e "${BLUE}[MEMORY]${NC} $(date '+%H:%M:%S') - Next.js using ${MEMORY_MB}MB"
      if [ $MEMORY_MB -gt 1000 ]; then
        echo -e "${RED}[WARNING]${NC} High memory usage detected!"
      fi
    fi
  done &
  MEMORY_PID=$!
}

# Cleanup function
cleanup() {
  echo ""
  echo -e "${YELLOW}Stopping monitoring...${NC}"
  if [ ! -z "$FSWATCH_PID" ]; then
    kill $FSWATCH_PID 2>/dev/null
  fi
  if [ ! -z "$MEMORY_PID" ]; then
    kill $MEMORY_PID 2>/dev/null
  fi
  echo -e "${GREEN}Done!${NC}"
  exit 0
}

# Set up trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Check if fswatch is installed
if command -v fswatch &> /dev/null; then
  monitor_files
else
  echo -e "${YELLOW}⚠️  fswatch not installed. File change monitoring disabled.${NC}"
  echo -e "${YELLOW}   Install with: brew install fswatch${NC}"
fi

# Start memory monitoring
monitor_memory

echo ""
echo -e "${GREEN}✅ Monitoring started${NC}"
echo -e "${BLUE}📊 Check console for detailed logs${NC}"
echo -e "${BLUE}🌐 Server will start at http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

# Start Next.js dev server
npm run dev
