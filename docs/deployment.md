# Deployment

Frontend and backend deploy separately: **Vercel** for the frontend,
a container/PaaS host (**Railway, Render, or Fly.io**) for the backend +
managed Postgres.

## Frontend → Vercel

```bash
cd frontend
npm run build
vercel deploy --prod
```

`vercel.json` already has the SPA rewrite rule so client-side routing
works on refresh/deep links. Set `VITE_API_URL` in the Vercel project's
environment variables to your deployed backend's URL (e.g.
`https://your-api.up.railway.app/api`).

## Backend → Railway / Render / Fly

Pick one host and provision:
1. A Postgres database (most of these hosts offer a managed one — use it
   instead of the local `docker-compose.yml`, which is dev-only)
2. A service pointed at `backend/`, with the start command `npm start`

Set these environment variables on the host (never commit real values):

```
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
CORS_ORIGIN=https://your-frontend.vercel.app
CUSTOM_AI_API_URL=
CUSTOM_AI_API_KEY=
OPENSOURCE_AI_API_URL=
OPENSOURCE_AI_API_KEY=
```

## Apply Migrations in Production

Run this once against the production database before or during your first
deploy, and again after every schema change:

```bash
npx prisma migrate deploy
```

This applies committed migrations from `backend/db/migrations/` — it does
**not** generate new ones (that's `prisma migrate dev`, for local
development only).

## Custom Domain (Hostinger)

1. In Vercel → Project → Settings → Domains, add your domain
2. Vercel gives you A/CNAME records — create them in Hostinger's DNS
   settings
3. Point a subdomain (e.g. `api.yourdomain.com`) at your backend host the
   same way, using whatever record type that host requires
4. SSL is auto-provisioned by both Vercel and most backend hosts once DNS
   verifies (can take up to 24h)

## Deploy Checklist

- [ ] `npx prisma migrate deploy` run against production DB
- [ ] All backend env vars set on the host
- [ ] `VITE_API_URL` on Vercel points at the deployed backend
- [ ] `CORS_ORIGIN` on the backend points at the deployed frontend
- [ ] Update `STATUS.md`
