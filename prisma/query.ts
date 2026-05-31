import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("DATABASE_URL:", connectionString ? "Exists" : "Not found");
  
  // 1. Get the current settings row
  try {
    const settings = await prisma.$queryRawUnsafe(`SELECT * FROM "Settings" LIMIT 1`);
    console.log("Settings rows:", JSON.stringify(settings, null, 2));
  } catch (err) {
    console.error("Error querying Settings:", err);
  }

  // 2. Get column types
  try {
    const columns = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Settings'
      AND column_name IN ('open_hour', 'close_hour')
    `);
    console.log("Settings column info:", JSON.stringify(columns, null, 2));
  } catch (err) {
    console.error("Error querying column types:", err);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
