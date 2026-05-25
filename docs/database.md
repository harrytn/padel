# Database Documentation

This document outlines important details and constraints regarding the database management for the Padel Booking project.

## Development & Prototyping

- `npx prisma db push` was used for the current prototype database to avoid resetting existing reservation data.
- During development and feature testing, pushing schema changes safely synchronized the local constraints without destructive data loss.
- Do **not** run destructive Prisma commands (`prisma migrate reset` or unapproved migrations) on the prototype database without explicit approval to avoid accidentally deleting active booking records.

## Production Preparation

For production deployment:
- We should create a clean, finalized Prisma migration from the complete schema before going live (e.g. `npx prisma migrate dev --name init` on a fresh state).

## Operational Workflow

The `Booking` model has been extended to support the administrative/reception workflow. The following timestamps are captured when a booking's `status` changes:
- `checked_in_at`: Captured when a booking is marked as `ARRIVED` (Check-in).
- `paid_at`: Captured when a booking is marked as `PAID`.
- `no_show_at`: Captured when a booking is marked as `NO_SHOW`.
- `cancelled_at`: Captured when a booking is marked as `CANCELLED`.
