export const STORE = {
  name: "RAFIK STOORE",
  tagline: "Everything you love, in one trusted place.",
  currency: "USD",
  locale: "en-US",
  freeShippingThresholdCents: 7500,
  standardShippingCents: 699,
  expressShippingCents: 1499,
  returnDays: 30,
  supportEmail: "support@rafikstoore.com",
  supportPhone: "+1 (800) 555-0142",
  supportHours: "Mon–Sat, 8:00–20:00",
} as const;

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const priceFormatter = new Intl.NumberFormat(STORE.locale, {
  style: "currency",
  currency: STORE.currency,
});

export function formatPrice(cents: number) {
  return priceFormatter.format(cents / 100);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat(STORE.locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function discountPercent(priceCents: number, compareAtCents: number | null | undefined) {
  if (!compareAtCents || compareAtCents <= priceCents) return 0;
  return Math.round(((compareAtCents - priceCents) / compareAtCents) * 100);
}

/** Build a sized Pexels CDN URL from a photo id. */
export function pexels(id: number, width = 900) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

export type DeliveryMethod = "standard" | "express";

export const DELIVERY_OPTIONS: ReadonlyArray<{ id: DeliveryMethod; label: string; eta: string }> = [
  { id: "standard", label: "Standard delivery", eta: "3–5 business days" },
  { id: "express", label: "Express delivery", eta: "1–2 business days" },
];

export const PAYMENT_OPTIONS = [
  { id: "cod", label: "Cash on delivery", description: "Pay in cash when your order arrives." },
  { id: "card_on_delivery", label: "Card on delivery", description: "Pay by card on our courier's terminal." },
  { id: "bank_transfer", label: "Bank transfer", description: "We'll email our bank details after you order." },
] as const;

export type PaymentMethod = (typeof PAYMENT_OPTIONS)[number]["id"];

export function shippingCostCents(subtotalCents: number, method: DeliveryMethod) {
  if (method === "express") return STORE.expressShippingCents;
  if (subtotalCents === 0 || subtotalCents >= STORE.freeShippingThresholdCents) return 0;
  return STORE.standardShippingCents;
}

export function deliveryLabel(id: string) {
  return DELIVERY_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

export function paymentLabel(id: string) {
  return PAYMENT_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

export type StatusTone = "warning" | "info" | "success" | "error" | "neutral";

export const ORDER_STATUS: Record<string, { label: string; tone: StatusTone; step: number }> = {
  processing: { label: "Processing", tone: "warning", step: 1 },
  shipped: { label: "Shipped", tone: "info", step: 2 },
  delivered: { label: "Delivered", tone: "success", step: 3 },
  cancelled: { label: "Cancelled", tone: "error", step: 0 },
};

export const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["id"];

export function isSortKey(value: string | undefined): value is SortKey {
  return SORT_OPTIONS.some((o) => o.id === value);
}

export const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "France",
  "Germany",
  "Spain",
  "Italy",
  "Netherlands",
  "Belgium",
  "Morocco",
  "Algeria",
  "Tunisia",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
] as const;

/** Only allow internal relative redirects. */
export function safeRedirectPath(value: unknown, fallback = "/account") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
