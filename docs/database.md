# Database Documentation

## Recent Changes

### Configurable Slot Duration (May 2026)
We added dynamic slot duration support. Because this is a prototype environment, `npx prisma db push` was used to apply these changes instead of a formal migration.

**Settings Model:**
- Added `slot_duration_minutes Int @default(90)`.
- Valid values enforced by API: 20, 30, 60, 90.

**Booking Model:**
- Added `duration_minutes Int @default(90)`.
- This ensures historical bookings retain the slot duration they were booked under, even if the admin changes the setting later.

### Double-Booking Prevention (May 2026)
- Double-booking is prevented by a PostgreSQL partial unique index named `Booking_active_slot_key`.
- The index enforces uniqueness on `(date, slot_start)` only for active statuses: `PENDING_PAYMENT`, `PAID`, `ARRIVED`, `NO_SHOW`.
- `CANCELLED` bookings intentionally do not block the slot and remain in the database as history.
- This index is applied via raw SQL / `prisma db execute` because the project currently uses `db push` style schema management.
- Do not re-add Prisma `@@unique([date, slot_start])`, because that would make cancelled bookings block rebooking again.
- Do not mutate `slot_start` on cancellation.
