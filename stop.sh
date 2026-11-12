#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

if [ -f server.pid ]; then
  PID=$(cat server.pid)
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID" 2>/dev/null
    rm -f server.pid
    echo "✅ Đã tắt landing page server (PID $PID)."
    exit 0
  fi
  rm -f server.pid
fi

pkill -f "node.*educonnect-landing/server.js" 2>/dev/null && echo "✅ Đã tắt landing page server." || echo "ℹ️ Server hiện không chạy."
