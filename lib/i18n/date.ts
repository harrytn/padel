import { Language } from "./translations";

export function formatLocalizedDate(isoDate: string, lang: Language): string {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T12:00:00");
  
  const formatter = new Intl.DateTimeFormat(lang, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  
  const formatted = formatter.format(d);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
