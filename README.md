# Hackathon Starter Template

A production-structured, AI-friendly starter kit for 24–48 hour hackathons.
This repo contains **no business logic** — just a clean, layered foundation
so your team can start building features in minute one instead of hour three.

## Tech Stack

| Layer      | Tech                                                          |
|------------|-----------------------------------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS, React Router                     |
| Backend    | Express + PostgreSQL, Prisma as the ORM                        |
| Auth       | JWT access/refresh tokens, bcrypt password hashing              |
| AI         | Provider-agnostic AI Router → custom/self-hosted or hosted open-source model |
| Deployment | Vercel (frontend) + Railway/Render/Fly (backend + Postgres)     |

## Why a real backend this time?

JWT auth, relational data with real foreign keys, and a single AI chokepoint
are easiest to reason about behind one layered Express API instead of
spreading authorization logic across security rules and client SDKs. Every
request flows the same way — `routes → controllers → services → Prisma →
Postgres` — so routes never contain logic, controllers never touch the
database, and services never know how a request arrived. See
[`docs/architecture.md`](docs/architecture.md) for the full walkthrough.

## Folder Structure

```
project/
├── frontend/     # React + Vite client — talks to the backend over REST
├── backend/      # Express API + PostgreSQL + AI router
├── contracts/    # REST API / DB schema / AI contract (docs only, frozen shapes)
├── docs/         # Architecture & setup documentation
├── scripts/      # Dev/setup automation scripts
├── .github/      # CI + PR templates
├── docker-compose.yml   # local PostgreSQL for development
├── AGENTS.md     # Guide for AI coding assistants (read this first)
├── STATUS.md     # Live project tracker
├── FEATURES.md   # Core / optional / stretch / kill-list features
└── README.md     # You are here
```

## Installation

```bash
git clone <your-repo-url>
cd project

cd backend && cp .env.example .env && npm install && cd ..
cd frontend && cp .env.example .env && npm install && cd ..
```

Or just run `./scripts/setup.sh`, which also starts Postgres, runs
migrations, and seeds demo data.

## Local Development

```bash
# Terminal 1 — Postgres
docker compose up -d

# Terminal 2 — backend
cd backend
npx prisma migrate dev   # first run only, or after a schema change
npm run dev              # http://localhost:4000

# Terminal 3 — frontend
cd frontend && npm run dev   # http://localhost:5173
```

Set `VITE_API_URL` in `frontend/.env` to point at the backend
(`http://localhost:4000/api` locally).

## Database Setup

See [`docs/database.md`](docs/database.md) — schema workflow, migrations,
seeding, and backups.

## Environment Variables

- `frontend/.env.example` — `VITE_API_URL` (the only var needed now)
- `backend/.env.example` — `DATABASE_URL`, JWT secrets, AI provider keys, `PORT`

## Deployment

```bash
# Frontend
cd frontend && vercel deploy --prod

# Backend
cd backend && npx prisma migrate deploy   # then deploy per your host (Railway/Render/Fly)
```

See [`docs/deployment.md`](docs/deployment.md) for the full walkthrough,
including custom domain setup via Hostinger DNS.

## Git Workflow

- Never commit directly to `main`
- Branch per feature: `feature/auth`, `feature/dashboard`, `feature/ai`
- Open a PR, get 1 review, squash-merge

## Team Workflow

- Each feature has a single owner
- **Definition of Done**: code merged, no console errors, matches contracts, reviewed
- **Architecture Freeze**: once contracts in `/contracts` and `backend/db/schema.prisma`
  are agreed, they cannot change without team sign-off

## AI Architecture

All AI calls flow through a single **AI Router** (`backend/src/ai/router`),
reached via `POST /api/ai/complete` so provider keys never reach the
browser. Providers are `custom` (self-hosted) and `opensource` (hosted
open-weight model) — swappable without touching application code. See
[`docs/architecture.md`](docs/architecture.md).

## Contributing

1. Create a feature branch
2. Follow conventions in `AGENTS.md`
3. Open a PR against `main`
4. Fill in `STATUS.md` as you go

## License

MIT — do whatever you want, just ship something great.
