// Plain JS seed script for Prisma + libsql (avoids ts-node ESM issues)
const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");
const path = require("path");

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      base_price: 100,
      racket_price_with_balls: 5,
      balls_only_price: 10,
      lighting_price: 20,
      peak_premium: 10,
      open_hour: 8,
      close_hour: 22,
      lighting_trigger_hour: "18:30",
      peak_slots: JSON.stringify(["17:00", "18:30", "20:00"]),
    },
  });

  console.log("✅ Seed complete: Settings row initialized.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
