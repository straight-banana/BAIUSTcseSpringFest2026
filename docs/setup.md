# Setup Guide

## Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL) — https://docs.docker.com/get-docker/

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd project

cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

Or just run `./scripts/setup.sh` from the repo root — it also starts
Postgres, runs migrations, and seeds demo data.

## 2. Start Postgres

```bash
docker compose up -d
```

This starts a local Postgres instance on `localhost:5432` (see
`docker-compose.yml`). Data persists in a named volume between restarts.

## 3. Environment Variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

- `backend/.env` — `DATABASE_URL` (already points at the local Postgres
  container by default), JWT secrets (generate with `openssl rand -base64 48`),
  AI provider URLs/keys
- `frontend/.env` — `VITE_API_URL` (defaults to `http://localhost:4000/api`)

See `docs/database.md` for more on the schema workflow.

## 4. Run Migrations & Seed Data

```bash
cd backend
npx prisma migrate dev --name init
node db/seeds/seed.js
cd ..
```

This creates the tables in `backend/db/schema.prisma` and inserts a demo
user (`demo@example.com` / `password123`) plus two example rows.

## 5. Run Locally

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Frontend: http://localhost:5173
Backend health check: http://localhost:4000/health

## 6. Verify

- Visit http://localhost:5173 — should show the starter Home page
- `curl http://localhost:4000/health` → `{"status":"ok"}`
- `POST http://localhost:4000/api/auth/login` with the seeded demo user
  should return an access + refresh token

## 7. Start Building

- Read `AGENTS.md` for conventions
- Check `FEATURES.md` for what to build
- Update `STATUS.md` as you go
- Every new endpoint goes: `routes → controllers → services → Prisma` —
  see `docs/architecture.md` for the full walkthrough
