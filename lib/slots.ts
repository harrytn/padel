/**
 * Converts a "HH:mm" string to total minutes since midnight.
 */
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Converts total minutes since midnight to "HH:mm" string.
 */
function fromMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Generates time slot start times from openingTime to closingTime
 * in steps of durationMinutes (default: 90).
 *
 * A slot is included only if slotStart + durationMinutes <= closingTime.
 *
 * @param openingTime "HH:mm"
 * @param closingTime "HH:mm"
 * @param durationMinutes defaults to 90
 * @returns array of "HH:mm" strings
 */
export function generateTimeSlots(
  openingTime: string,
  closingTime: string,
  durationMinutes = 90
): string[] {
  const open = toMinutes(openingTime);
  const close = toMinutes(closingTime);
  const slots: string[] = [];
  let current = open;
  while (current + durationMinutes <= close) {
    slots.push(fromMinutes(current));
    current += durationMinutes;
  }
  return slots;
}

/**
 * Given a slot start time "HH:MM", returns the end time (start + 90 min).
 */
export function getSlotEnd(start: string, durationMinutes = 90): string {
  const total = toMinutes(start) + durationMinutes;
  return fromMinutes(total);
}

/**
 * Returns true if the slot is in the peakSlots array from Settings.
 */
export function isPeakSlot(start: string, peakSlots: string[]): boolean {
  return peakSlots.includes(start);
}

/**
 * Returns true if this slot should show the lighting option.
 * Lighting applies when slotStart >= lightingTriggerHour.
 */
export function needsLightingOption(
  start: string,
  triggerHour: string
): boolean {
  return toMinutes(start) >= toMinutes(triggerHour);
}

/**
 * Parse the peak_slots JSON string from the Settings row.
 */
export function parsePeakSlots(peakSlotsJson: string): string[] {
  try {
    return JSON.parse(peakSlotsJson);
  } catch {
    return ["17:00", "18:30", "20:00"];
  }
}

/**
 * Normalizes an opening/closing hour value (stored in DB) to "HH:mm".
 * Handles:
 *   - Plain integer hours: 8 → "08:00"
 *   - HHMM integer strings: "700" → "07:00", "2300" → "23:00", "1830" → "18:30"
 *   - Already-formatted strings: "08:00" → "08:00"
 *   - Integer-as-string for whole hours: "8" → "08:00", "22" → "22:00"
 */
export function normalizeHour(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "08:00";
  const str = String(value).trim();
  
  if (str.includes(":")) {
    const parts = str.split(":");
    const h = parts[0] || "0";
    const m = parts[1] || "0";
    return `${h.padStart(2, "0")}:${m.padEnd(2, "0").slice(0, 2)}`;
  }
  
  const n = parseInt(str, 10);
  if (!isNaN(n)) {
    if (n >= 100) {
      const h = Math.floor(n / 100);
      const m = n % 100;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }
    return `${String(n).padStart(2, "0")}:00`;
  }
  
  return "08:00";
}

