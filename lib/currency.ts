export type Currency = "TND" | "EUR";

export function formatPrice(amount: number, currency: Currency | string = "TND") {
  return currency === "EUR" ? `${amount} €` : `${amount} TND`;
}
