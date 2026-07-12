import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: { email: "demo@example.com", passwordHash },
  });

  await prisma.example.createMany({
    data: [
      { name: "Sample Item One", status: "active", ownerId: user.id },
      { name: "Sample Item Two", status: "inactive", ownerId: user.id },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded: demo@example.com / password123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
