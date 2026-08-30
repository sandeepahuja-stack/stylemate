"use client";

import { forwardRef } from "react";
import Link from "next/link";
import type { Product } from "@/domain/types";
import { formatPrice } from "@/lib/format";

export function ProductCard({
  product,
  match,
  reason,
}: {
  product: Product;
  match?: number;
  reason?: string;
}) {
  return (
    <article className="group">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-container">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {match != null ? (
            <span className="absolute left-4 top-4 border border-outline-variant bg-surface px-3 py-1 text-[11px] tracking-[0.12em] uppercase">
              {match}% Style Match
            </span>
          ) : null}
        </div>
        <div className="mt-4">
          <p className="text-[11px] tracking-[0.14em] text-secondary uppercase">{product.brand}</p>
          <h3 className="mt-1 font-serif text-[22px] leading-tight">{product.name}</h3>
          <p className="mt-1 text-sm text-on-surface-variant">{formatPrice(product.price)}</p>
          {reason ? (
            <p className="mt-3 text-sm font-light leading-6 text-on-surface-variant">{reason}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }
>(function Button({ children, variant = "primary", className = "", ...props }, ref) {
  const styles =
    variant === "primary"
      ? "bg-primary text-on-primary hover:bg-[#474746]"
      : "border border-primary bg-transparent text-primary hover:bg-surface-container";
  return (
    <button
      ref={ref}
      className={`rounded-[4px] px-6 py-3 text-[12px] font-semibold tracking-[0.12em] uppercase transition-colors duration-300 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
