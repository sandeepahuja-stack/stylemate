export function formatPrice(inr: number) {
  return `₹${inr.toLocaleString("en-IN")}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
