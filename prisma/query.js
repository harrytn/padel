const { Client } = require("pg");
require("dotenv").config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  console.log("DATABASE_URL exists:", !!connectionString);
  if (!connectionString) {
    console.error("No DATABASE_URL found in process.env");
    return;
  }
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to DB successfully.");

    // 1. Get the current settings row
    const resSettings = await client.query('SELECT * FROM "Settings" LIMIT 1');
    console.log("Settings rows:", JSON.stringify(resSettings.rows, null, 2));

    // 2. Get column types
    const resColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Settings'
      AND column_name IN ('open_hour', 'close_hour')
    `);
    console.log("Settings column info:", JSON.stringify(resColumns.rows, null, 2));

  } catch (err) {
    console.error("Error executing queries:", err);
  } finally {
    await client.end();
  }
}

main();
