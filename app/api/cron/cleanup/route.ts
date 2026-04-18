import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const d = new Date();
    d.setDate(d.getDate() - 7);
    const thresholdDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const { count } = await prisma.booking.deleteMany({
      where: {
        date: {
          lt: thresholdDate,
        },
      },
    });

    return NextResponse.json({ success: true, deletedCount: count, threshold: thresholdDate });
  } catch (error) {
    console.error("Cleanup cron job failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
