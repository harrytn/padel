import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!existing) {
    console.log("No settings row found — skipping.");
    return;
  }
  // Normalize open_hour and close_hour to HH:mm if they are plain integers
  const normalizeHour = (v: string | number): string => {
    if (typeof v === "number") return `${String(v).padStart(2, "0")}:00`;
    if (/^\d{2}:\d{2}$/.test(v)) return v;
    const n = parseInt(v, 10);
    if (!isNaN(n)) return `${String(n).padStart(2, "0")}:00`;
    return v;
  };
  const openHour = normalizeHour(existing.open_hour as unknown as string | number);
  const closeHour = normalizeHour(existing.close_hour as unknown as string | number);
  await prisma.settings.update({
    where: { id: 1 },
    data: { open_hour: openHour, close_hour: closeHour },
  });
  console.log(`✅ Updated settings: open_hour=${openHour}, close_hour=${closeHour}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
