#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

pkill -f "node.*educonnect-landing/server.js" 2>/dev/null || true
sleep 0.5

if command -v setsid >/dev/null 2>&1; then
  setsid nohup node server.js > "$DIR/server.log" 2>&1 < /dev/null &
else
  nohup node server.js > "$DIR/server.log" 2>&1 < /dev/null &
fi
PID=$!
echo $PID > "$DIR/server.pid"
disown $PID 2>/dev/null || true

echo "====================================================="
echo "  🌟 EduConnect Landing Page đã khởi động ngầm!"
echo "  🆔 PID: $PID"
echo "  🌐 Truy cập: http://127.0.0.1:18702"
echo "  📄 Log: $DIR/server.log"
echo "====================================================="
