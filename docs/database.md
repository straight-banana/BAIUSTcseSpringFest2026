# Database

## 1. Local Postgres

Local development uses the Postgres container defined in the root
`docker-compose.yml`:

```bash
docker compose up -d      # start
docker compose down       # stop (data persists in the named volume)
docker compose down -v    # stop AND wipe local data
```

Default local connection string (already in `backend/.env.example`):

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hackathon?schema=public
```

## 2. Schema Workflow

`backend/db/schema.prisma` is the single source of truth for table shape.

1. Edit `backend/db/schema.prisma`
2. Generate + apply a migration:
   ```bash
   cd backend
   npx prisma migrate dev --name <short-description>
   ```
   This creates a new folder under `backend/db/migrations/` — **commit it**.
   Never hand-edit files inside `db/migrations/`.
3. Update `contracts/db-schema.md` in the same change so the two stay in sync
4. Regenerate the Prisma client (usually automatic after `migrate dev`, but
   run it explicitly if types look stale):
   ```bash
   npx prisma generate
   ```

## 3. Seeding

```bash
cd backend
node db/seeds/seed.js
```

Add more seed data by editing `backend/db/seeds/seed.js`. Keep seed data
realistic but obviously fake (e.g. `demo@example.com`) so it's never
mistaken for real user data.

## 4. Inspecting Data

```bash
cd backend
npx prisma studio
```

Opens a local GUI at `http://localhost:5555` for browsing/editing rows —
useful for debugging without writing raw SQL.

## 5. Production Migrations

```bash
npx prisma migrate deploy
```

Applies committed migrations from `backend/db/migrations/` to whatever
`DATABASE_URL` is set in the environment. Run this against production as
part of every deploy that includes a schema change — see
`docs/deployment.md`.

## 6. Backups

Managed Postgres hosts (Railway, Render, Fly Postgres, Neon, Supabase,
etc.) typically offer automated daily backups/point-in-time recovery —
enable this on whichever host you deploy to. For manual backups:

```bash
pg_dump "$DATABASE_URL" > backup.sql
```

Restore with:

```bash
psql "$DATABASE_URL" < backup.sql
```

Never commit a `.sql` dump containing real user data to the repo.
