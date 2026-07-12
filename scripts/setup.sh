#!/usr/bin/env bash
# One-shot setup: starts Postgres, installs deps, copies env files, and
# runs migrations for frontend + backend.
set -e

if ! command -v docker &> /dev/null; then
  echo "Docker not found. Install Docker to run local Postgres: https://docs.docker.com/get-docker/"
  exit 1
fi

echo "Starting Postgres (docker-compose)..."
docker compose up -d

echo "Setting up backend..."
cd backend
[ -f .env ] || cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
node db/seeds/seed.js
cd ..

echo "Setting up frontend..."
cd frontend
[ -f .env ] || cp .env.example .env
npm install
cd ..

echo ""
echo "Done. Next steps:"
echo "  1. cd backend && npm run dev    (terminal 1 — API on :4000)"
echo "  2. cd frontend && npm run dev   (terminal 2 — app on :5173)"
