#!/usr/bin/env bash
set -e
HERE="$(cd "$(dirname "$0")/.." && pwd)"
cd "$HERE"

if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt
# Intentar arrancar ollama si está disponible (startup.py lo maneja)
uvicorn main:app --host 127.0.0.1 --port ${DESKTOP_BACKEND_PORT:-8765}
