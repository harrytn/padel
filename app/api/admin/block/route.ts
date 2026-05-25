import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBookingPin } from "@/lib/pricing";
import { requireAdmin } from "@/lib/auth";

/**
 * POST /api/admin/block
 * Admin only — Reception cannot block court time slots.
 */
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { date, slotStart } = await request.json();

    if (!date || !slotStart) {
      return NextResponse.json(
        { error: "date and slotStart are required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        booking_pin: generateBookingPin(),
        type: "ADMIN_BLOCK",
        date,
        slot_start: slotStart,
        total_price: 0,
        status: "PAID",
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "SLOT_ALREADY_BOOKED" },
        { status: 409 }
      );
    }
    console.error("POST /api/admin/block error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
