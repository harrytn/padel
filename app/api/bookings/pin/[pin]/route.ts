import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pin: string }> }
) {
  try {
    const { pin } = await params;
    if (!pin) {
      return NextResponse.json({ error: "Missing PIN" }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { booking_pin: pin },
      select: { currency: true, total_price: true, date: true, slot_start: true }
    });

    if (!booking) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("GET /api/bookings/pin/[pin] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
