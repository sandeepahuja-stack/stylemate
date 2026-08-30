import { getProductDetails } from "./search";
import type { CompareRow, Product, StyleProfile } from "./types";
import { scoreProduct } from "./recommendations";
import { parseIntent } from "./profile";

export function compareProducts(
  ids: string[],
  profile: StyleProfile,
  intentText = "",
): { products: Product[]; rows: CompareRow[]; verdict: string; winnerId: string } {
  const products = ids.map(getProductDetails);
  const intent = parseIntent(intentText);
  const scored = products.map((product) => {
    const { ranking, match, reasons } = scoreProduct(product, profile, intent);
    return { product, match, reasons, ranking };
  });
  scored.sort((a, b) => b.ranking - a.ranking);
  const winner = scored[0];

  const rows: CompareRow[] = [
    row("price", "Price", products, (p) => `₹${p.price.toLocaleString("en-IN")}`),
    row("material", "Material", products, (p) => p.materials.join(", ")),
    row("fit", "Fit", products, (p) => p.fit),
    row("color", "Color", products, (p) => p.colors.join(", ")),
    row("craftsmanship", "Craftsmanship", products, (p) => p.craftsmanship),
    row("style", "Style", products, (p) => p.style.join(", ")),
    row("occasion", "Occasion", products, (p) => p.occasion.join(", ")),
    row("versatility", "Versatility", products, (p) => (p.occasion.length >= 3 ? "High" : "Focused")),
    row(
      "match",
      "Style Match",
      products,
      (p) => `${scored.find((s) => s.product.id === p.id)?.match ?? 0}%`,
    ),
    row("availability", "Availability", products, (p) =>
      Object.values(p.inventory).some((n) => n > 0) ? "In atelier" : "Waitlist",
    ),
  ];

  const verdict = intentText
    ? `For your ${intent.styles[0] ? intent.styles[0].toLowerCase() + " " : ""}brief${intent.pairing.length ? " with a black suit" : ""}, I'd choose ${winner.product.name}.`
    : `${winner.product.name} is the most considered choice for this client.`;

  return { products, rows, verdict, winnerId: winner.product.id };
}

function row(
  key: string,
  label: string,
  products: Product[],
  value: (product: Product) => string,
): CompareRow {
  return {
    key,
    label,
    values: Object.fromEntries(products.map((p) => [p.id, value(p)])),
  };
}
