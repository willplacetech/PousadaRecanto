#!/bin/bash
cd /tmp/build
export NODE_ENV=production
if [ -f .vercel/output/functions/__server.func/index.mjs ]; then
  node .vercel/output/functions/__server.func/index.mjs
else
  npx vite preview --host 0.0.0.0 --port 8080
fi