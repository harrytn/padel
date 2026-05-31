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
