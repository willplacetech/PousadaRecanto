#!/bin/sh
cd "$(dirname "$0")" || exit 1
if curl -sf -o /dev/null --max-time 1 http://127.0.0.1:8080/ 2>/dev/null; then
  exit 0
fi
npm run dev > /tmp/dev-server.log 2>&1 &
exit 0