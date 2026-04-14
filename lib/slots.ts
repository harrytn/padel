/** The 9 canonical slot start times for the padel court */
export const ALL_SLOTS = [
  "08:00",
  "09:30",
  "11:00",
  "12:30",
  "14:00",
  "15:30",
  "17:00",
  "18:30",
  "20:00",
] as const;

export type SlotTime = (typeof ALL_SLOTS)[number];

/**
 * Given a slot start time "HH:MM", returns the end time (start + 90 min).
 */
export function getSlotEnd(start: string): string {
  const [hours, minutes] = start.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + 90;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
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
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
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
