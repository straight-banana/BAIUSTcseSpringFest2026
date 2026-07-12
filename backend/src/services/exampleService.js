import { prisma } from "../config/prisma.js";

// Matches contracts/db-schema.md's `examples` table. Swap the shape/logic
// as you build real features — this is intentionally minimal.

export async function listExamples() {
  return prisma.example.findMany({ orderBy: { createdAt: "asc" } });
}

export async function createExample({ name, status = "active" }, ownerId) {
  return prisma.example.create({ data: { name, status, ownerId } });
}
