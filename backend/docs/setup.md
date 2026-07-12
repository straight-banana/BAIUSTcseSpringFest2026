# Setup Guide — Hackathon Backend

## Prerequisites
- Node.js 18+ installed
- Git installed
- Aiven PostgreSQL credentials (host, port, user, password)

---

## Step 1 — Clone & Install

```bash
git clone <your-repo-url>
cd backend
npm install
```

---

## Step 2 — Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
DATABASE_URL="postgresql://avnadmin:YOUR_REAL_PASSWORD@pg-37514dc-demo-practice.k.aivencloud.com:13961/defaultdb?sslmode=require"
JWT_SECRET=any_long_random_string_here
FRONTEND_URL=http://localhost:3000
```

> **Where to find your Aiven password**: Aiven Console → your service → "Connection information" → password field.

---

## Step 3 — Create Database Tables

```bash
npm run db:push
```

This reads `db/schema.prisma` and creates all tables in your Aiven PostgreSQL database. No migration files needed for hackathon speed.

---

## Step 4 — Seed Sample Data (Optional)

```bash
npm run db:seed
```

Creates:
- 1 admin account: `ADMIN` / `admin123`
- 30 students: roll `001`–`030` / password `student123`

---

## Step 5 — Start the Server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Server starts on `http://localhost:5000`

Test it:
```bash
curl http://localhost:5000/health
# { "success": true, "message": "Server is running" }
```

---

## Step 6 — Deploy to Railway (Free Hosting)

1. Push your code to GitHub (make sure `.env` is in `.gitignore` ✅)

2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub Repo**

3. Select your repository

4. In Railway dashboard → **Variables**, add:
   ```
   DATABASE_URL = postgresql://avnadmin:PASS@host:13961/defaultdb?sslmode=require
   JWT_SECRET   = your-secret
   FRONTEND_URL = https://your-app.vercel.app
   NODE_ENV     = production
   PORT         = 5000
   ```

5. Railway auto-runs `npm start` — done!

6. Run the migration from Railway's shell:
   ```bash
   npx prisma db push
   ```

7. Your backend URL will be: `https://your-app.railway.app`

---

## Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with file watcher (development) |
| `npm start` | Start for production |
| `npm run db:push` | Push schema to database (no migration file) |
| `npm run db:migrate` | Create a migration + push |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:generate` | Re-generate Prisma Client |

---

## Folder Structure

```
backend/
├── app.js              ← Express app (middleware + routes)
├── server.js           ← HTTP server + Socket.IO
├── .env                ← YOUR SECRETS (never commit this)
├── prisma.config.ts    ← Prisma 7 datasource config
├── db/
│   ├── schema.prisma   ← Database schema (single source of truth)
│   └── seeds/seed.js   ← Sample data seeder
├── src/
│   ├── config/env.js   ← Env validation
│   ├── middleware/     ← auth, errorHandler, asyncWrapper, validate
│   ├── routes/         ← URL definitions only
│   ├── controllers/    ← req/res handling
│   ├── services/       ← business logic + Prisma queries
│   ├── validators/     ← express-validator schemas
│   └── utils/          ← apiResponse, logger, password, tokens, exifStrip
├── uploads/            ← Uploaded images (auto-created)
└── logs/               ← Application logs (auto-created)
```
