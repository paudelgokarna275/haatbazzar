#!/bin/sh
set -e

echo "==> Waiting for PostgreSQL..."
until python -c "
import socket, sys, os
host = os.environ.get('DATABASE_URL', '').split('@')[-1].split('/')[0].split(':')
h = host[0] if host else 'db'
p = int(host[1]) if len(host) > 1 else 5432
s = socket.create_connection((h, p), timeout=2)
s.close()
print('DB reachable')
" 2>/dev/null; do
  echo "  DB not ready, retrying in 2s..."
  sleep 2
done

echo "==> Running Alembic migrations..."
alembic upgrade head || echo "  Migrations already up to date."

echo "==> Starting uvicorn..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --workers 1
