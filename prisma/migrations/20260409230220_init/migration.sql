-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "base_price" REAL NOT NULL DEFAULT 100,
    "racket_price_with_balls" REAL NOT NULL DEFAULT 5,
    "balls_only_price" REAL NOT NULL DEFAULT 10,
    "lighting_price" REAL NOT NULL DEFAULT 20,
    "peak_premium" REAL NOT NULL DEFAULT 10,
    "open_hour" INTEGER NOT NULL DEFAULT 8,
    "close_hour" INTEGER NOT NULL DEFAULT 22,
    "lighting_trigger_hour" TEXT NOT NULL DEFAULT '18:30',
    "peak_slots" TEXT NOT NULL DEFAULT '["17:00","18:30","20:00"]'
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "booking_pin" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TOURIST_BOOKING',
    "customer_first_name" TEXT,
    "customer_last_name" TEXT,
    "room_number" TEXT,
    "date" TEXT NOT NULL,
    "slot_start" TEXT NOT NULL,
    "racket_count" INTEGER NOT NULL DEFAULT 0,
    "bought_balls_only" BOOLEAN NOT NULL DEFAULT false,
    "needs_lighting" BOOLEAN NOT NULL DEFAULT false,
    "total_price" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_date_slot_start_key" ON "Booking"("date", "slot_start");
