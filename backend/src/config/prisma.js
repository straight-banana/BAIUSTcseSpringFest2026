import { PrismaClient } from "@prisma/client";

// One Prisma client for the whole process. Import this everywhere instead
// of instantiating `new PrismaClient()` per file — avoids exhausting the
// Postgres connection pool in dev (hot reload) and in serverless hosts.
export const prisma = new PrismaClient();
