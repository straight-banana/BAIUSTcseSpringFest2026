# API Overview

This is a human-readable overview. The **source of truth** is
[`contracts/api.md`](../contracts/api.md) for endpoints and
[`contracts/db-schema.md`](../contracts/db-schema.md) for the underlying
tables — update these together with the code.

## How data moves in this app

Frontend → REST API (`/api/*`) → Express routes → controllers → services
→ Prisma → Postgres. No Firestore, no direct database access from the
client — every read/write goes through the layered backend described in
`docs/architecture.md`.

## Current Endpoints

| Method | Path                  | Auth required | Description                          |
|--------|-----------------------|----------------|----------------------------------------|
| POST   | `/api/auth/register`  | No             | Create an account, returns tokens       |
| POST   | `/api/auth/login`     | No             | Log in, returns tokens                  |
| POST   | `/api/auth/refresh`   | No             | Exchange a refresh token for a new access token |
| GET    | `/api/examples`       | Yes            | List examples                           |
| POST   | `/api/examples`       | Yes            | Create an example                       |
| POST   | `/api/ai/complete`    | Yes            | Route a prompt to the configured AI provider |

## Current Tables

See `contracts/db-schema.md` for the full schema. Currently: `users`,
`refresh_tokens`, `examples`.
