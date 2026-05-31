import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const connectionString = process.env.DATABASE_URL || "";
  let host = "";
  let dbName = "";
  try {
    const url = new URL(connectionString);
    host = url.host;
    dbName = url.pathname.replace(/^\//, "");
  } catch (e) {
    host = "invalid-url";
  }

  const debugInfo: any = {
    databaseHost: host,
    databaseName: dbName,
    columns: [],
    rawSettings: [],
    prismaError: null,
    prismaSuccess: false,
  };

  // 1. Direct PG check
  if (connectionString && connectionString !== "invalid-url") {
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      
      const columnsRes = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'Settings'
      `);
      debugInfo.columns = columnsRes.rows;

      const settingsRes = await client.query('SELECT * FROM "Settings"');
      debugInfo.rawSettings = settingsRes.rows;

      await client.end();
    } catch (err: any) {
      debugInfo.pgError = err.message || String(err);
    }
  } else {
    debugInfo.pgError = "No DATABASE_URL env var";
  }

  // 2. Prisma Check
  try {
    const s = await prisma.settings.findFirst();
    debugInfo.prismaSuccess = true;
    debugInfo.prismaSettings = s;
  } catch (err: any) {
    debugInfo.prismaError = {
      message: err.message,
      code: err.code,
      meta: err.meta,
    };
  }

  return NextResponse.json(debugInfo);
}
