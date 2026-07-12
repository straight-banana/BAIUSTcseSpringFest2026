# AGENTS.md — Read This First

This file is the entry point for any AI coding assistant (Claude, ChatGPT,
Cursor, Copilot, Lovable, etc.) working in this repository. Read it before
generating or modifying any code.

## 1. Project Overview

This is a **hackathon starter template** — a scaffold, not a finished app.
Architecture: **React + Vite frontend, Express + PostgreSQL backend**,
Prisma as the ORM, with a single provider-agnostic AI router. Everything
goes through the backend API — there is no direct database access from the
frontend.

## 2. Golden Rule: Never Skip a Layer

Every request flows through the same chain, and nothing skips ahead:

```
Frontend → Routes → Controllers → Services → Prisma → Postgres
                                        ↓
                                    AI Router → Provider
```

- **Routes** (`backend/src/routes`) only wire up middleware + a controller.
  No logic lives here.
- **Controllers** (`backend/src/controllers`) read `req`/`res`, call a
  service, and wrap the result in the response envelope. They never touch
  Prisma directly.
- **Services** (`backend/src/services`) hold the actual business logic and
  the Prisma queries. They don't know or care whether the caller was HTTP,
  a script, or a test.
- **Prisma** translates service calls into SQL against Postgres, using the
  shape defined in `backend/db/schema.prisma`.

This is what makes the app testable and lets multiple people work on
different layers without stepping on each other — if you later add a CLI
script or background job, it calls the service function directly, no HTTP
round-trip needed.

## 3. Folder Responsibilities

### Frontend (`frontend/src`)
- `components/common` — generic reusable pieces (Button, Card, Modal, Toast...)
- `components/forms` — form inputs and form-specific composites
- `components/layout` — Navbar, Sidebar, PageLayout, Footer
- `components/ui` — small presentational primitives (Badge, Spinner, Divider)
- `components/feedback` — Loading, EmptyState, ErrorState
- `pages` — route-level screens
- `routes` — React Router route definitions
- `hooks` — custom hooks (data fetching, form state, etc.)
- `context` — `AppContext.jsx`: global state, now also holds the
  logged-in user + JWT tokens
- `services` — `api.js` (the shared Axios instance, attaches the
  `Authorization` header), `authService.js`, per-resource services (e.g.
  `exampleService.js`), and `aiService.js` (calls `POST /api/ai/complete`)
- `constants` — enums, static config values
- `config` — any client-side config; there's no Firebase config here anymore
- `utils` — pure helper functions
- `mocks` — fake REST responses so frontend devs never block on the backend

### Backend (`backend/`)
- `app.js` — Express app: middleware + route mounting, no `server.listen`
- `server.js` — starts the HTTP server
- `db/schema.prisma` — single source of truth for table shape
- `db/migrations` — generated, committed migration history; **never
  hand-edited** — run `npx prisma migrate dev --name <description>` instead
- `db/seeds` — scripts to populate dev/test data
- `src/config` — `env.js` (reads/validates `process.env`), `prisma.js`
  (the shared Prisma client)
- `src/middleware` — `auth.js` (verifies JWT, attaches `req.user`),
  `errorHandler.js`, `asyncWrapper.js`, `validate.js`, `logger.js`
- `src/routes` — Express route definitions only
- `src/controllers` — req/res handling, calls services, no Prisma calls
- `src/services` — business logic + Prisma queries
- `src/validators` — Zod schemas for request payloads
- `src/models` — thin wrappers around Prisma models, only if extra shaping
  logic is needed
- `src/utils` — `apiResponse.js` (`successResponse()`/`errorResponse()`
  envelope), `logger.js`, `password.js` (bcrypt), `tokens.js` (JWT)
- `src/external` — non-AI third-party API clients

### AI Layer (`backend/src/ai`)
- `router` — single entry point; app code calls the router, never a
  provider directly
- `providers/custom` — self-hosted/custom model server (Ollama, vLLM,
  fine-tune)
- `providers/opensource` — hosted open-weight model via inference API
- `agents` — higher-level agent orchestration on top of providers
- `classifiers` — small-task classification logic
- `pipelines` — multi-step AI workflows
- `prompts` — prompt templates, versioned
- `memory` — conversation/context storage helpers
- `evaluation` — scoring/testing of AI outputs
- `datasets` — sample/eval data for AI features

## 4. Coding Standards

- ES Modules (`import`/`export`) everywhere, no `require`
- `async/await` only, no raw `.then()` chains
- Functional React components + hooks, no class components
- Keep files small and single-purpose
- Comment only non-obvious logic — no narration comments

## 5. Naming Conventions

- Components: `PascalCase.jsx` (e.g. `UserCard.jsx`)
- Hooks: `useCamelCase.js` (e.g. `useAuth.js`)
- Services/utils: `camelCase.js`
- Prisma models: `PascalCase` singular (e.g. `Example`), mapped to
  `snake_case` plural table names via `@@map` (e.g. `examples`)
- Express routes: `camelCase` resource-plural files (e.g. `exampleRoutes.js`)
  mounted at `snake_case`-free REST paths (e.g. `/api/examples`)

## 6. Response Format (REST API)

Every response uses this envelope (see `backend/src/utils/apiResponse.js`):

```json
{
  "success": true,
  "data": {},
  "error": null,
  "message": "Optional human-readable message"
}
```

## 7. Database Conventions

- Table names: plural, `snake_case` (via Prisma's `@@map`)
- Every table: `createdAt`, `updatedAt`
- Prefer foreign keys + `include`/`select` over denormalizing data
- Schema lives in `backend/db/schema.prisma` — update it AND
  `contracts/db-schema.md` in the same change whenever a shape changes
- Never hand-edit `backend/db/migrations/**` — always generate via
  `npx prisma migrate dev`

## 8. Environment Variables

- Never hardcode secrets
- Frontend vars must be prefixed `VITE_` and are safe to expose (they're
  client config, not secrets)
- Backend vars (`DATABASE_URL`, JWT secrets, AI keys, etc.) live in
  `backend/.env` locally and in your host's secret manager in production —
  never in frontend code

## 9. Prompting Guidelines (for AI features)

- Store prompt templates in `backend/src/ai/prompts`, not inline in code
- Keep system prompts short and task-specific
- Version prompts (e.g. `classifyIntent.v1.js`) rather than editing in place once in use
- Log provider + prompt version alongside AI outputs for debugging

## 10. Git Workflow

- Branch naming: `feature/<name>` (e.g. `feature/auth`, `feature/ai`)
- Never push to `main` directly
- PRs require at least one reviewer
- Squash-merge to keep history clean

## 11. Files AI Assistants Should Never Modify Automatically

- `.env` (any real environment file — only `.env.example` is safe to touch)
- `contracts/*.md` (only touch after explicit team/human approval — this is the Architecture Freeze)
- `backend/db/migrations/**` — generated by Prisma, never hand-written
- `backend/db/schema.prisma` without explicit request — a bad schema change
  is a data-loss risk once migrations are generated from it
- Any service account / credentials file
- `.github/workflows/*.yml` without explicit request
- `package-lock.json` (let the package manager manage this)

When in doubt, propose the change and ask before overwriting a contract,
schema, or config file.
