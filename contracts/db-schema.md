# Database Schema Contract

**Architecture Freeze**: schema changes here require team approval once
tables are in use by shipped features.

This is now the **primary data contract in the app** — `backend/db/schema.prisma`
is the executable source of truth, and this file is its human-readable
mirror. Update both together.

## Conventions

- Table names: plural, `snake_case` (via Prisma's `@@map`)
- Every table has `createdAt` and `updatedAt`
- Prefer real foreign keys over duplicated/denormalized fields
- Never hand-edit `backend/db/migrations/**` — regenerate via
  `npx prisma migrate dev --name <description>` after editing `schema.prisma`

## Tables

### `users`
| Field          | Type      | Notes                          |
|----------------|-----------|----------------------------------|
| `id`           | uuid      | primary key                     |
| `email`        | string    | unique                          |
| `passwordHash` | string    | bcrypt hash, never returned by the API |
| `createdAt`    | timestamp |                                  |
| `updatedAt`    | timestamp |                                  |

### `refresh_tokens`
| Field       | Type      | Notes                              |
|-------------|-----------|--------------------------------------|
| `id`        | uuid      | primary key                         |
| `userId`    | uuid      | FK → `users.id`, cascade delete     |
| `tokenHash` | string    | bcrypt hash of the refresh token, never stored in plaintext |
| `createdAt` | timestamp |                                      |
| `revokedAt` | timestamp | nullable — set to revoke before expiry |

### `examples`
Placeholder table matching the example API route.

| Field       | Type      | Notes                     |
|-------------|-----------|---------------------------|
| `id`        | uuid      | primary key               |
| `name`      | string    | required                  |
| `status`    | string    | `active` \| `inactive`    |
| `ownerId`   | uuid      | FK → `users.id`, for owner-only writes |
| `createdAt` | timestamp |                           |
| `updatedAt` | timestamp |                           |

---

Add new tables below as features are built, and keep field names
consistent with `backend/src/models`.
