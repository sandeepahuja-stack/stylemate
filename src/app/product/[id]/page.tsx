"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AgentActivity } from "@/components/AgentActivity";
import { Button } from "@/components/ProductCard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { getProductById } from "@/domain/catalog";
import { DEFAULT_PROFILE } from "@/domain/profile";
import { scoreProduct } from "@/domain/recommendations";
import { parseIntent } from "@/domain/profile";
import { buildOutfit } from "@/domain/outfit";
import { addToCart, addToWishlist } from "@/domain/store";
import { useStylemate } from "@/domain/use-stylemate";
import { formatPrice } from "@/lib/format";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);
  const { lastIntent, profile } = useStylemate();
  const [size, setSize] = useState(product ? Object.keys(product.inventory)[0] : "");

  if (!product) {
    return (
      <>
        <SiteHeader />
        <main className="px-5 py-24 text-center">This piece is no longer in the private edit.</main>
      </>
    );
  }

  const intent = parseIntent(lastIntent || "vintage date black suit");
  const { match, reasons } = scoreProduct(product, profile ?? DEFAULT_PROFILE, intent);
  const look = buildOutfit(product.id);

  return (
    <>
      <SiteHeader active="Collection" />
      <AgentActivity />
      <main className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="relative md:col-span-7">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-[70vh] w-full object-cover"
            />
          </div>
          <div className="md:col-span-5 md:pl-8">
            <p className="text-[12px] tracking-[0.16em] text-gold uppercase">{product.brand}</p>
            <h1 className="mt-3 font-serif text-[40px] leading-tight">{product.name}</h1>
            <p className="mt-3 text-lg">{formatPrice(product.price)}</p>
            <p className="mt-8 font-light leading-8 text-on-surface-variant">{product.description}</p>
            <dl className="mt-8 space-y-3 border-t border-outline-variant pt-6 text-sm">
              <Row label="Material" value={product.materials.join(", ")} />
              <Row label="Craftsmanship" value={product.craftsmanship} />
              <Row label="Fit" value={product.fit} />
            </dl>

            <fieldset className="mt-8">
              <legend className="text-[11px] tracking-[0.14em] uppercase">Available sizes</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(product.inventory).map(([value, qty]) => (
                  <button
                    key={value}
                    onClick={() => setSize(value)}
                    disabled={qty === 0}
                    className={`min-w-12 border px-3 py-2 text-sm ${
                      size === value ? "border-primary bg-primary text-on-primary" : "border-outline-variant"
                    } ${qty === 0 ? "opacity-30" : ""}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>

            <p className="mt-6 text-sm text-secondary">Colors: {product.colors.join(", ")}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => addToWishlist(product.id)}>Add to Wardrobe</Button>
              <Button variant="ghost" onClick={() => addToCart(product.id, size)}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        <section className="mt-[120px] max-w-2xl">
          <p className="text-[12px] tracking-[0.16em] text-gold uppercase">Why this suits you</p>
          <h2 className="mt-3 font-serif text-[32px]">{match}% Style Match</h2>
          <ul className="mt-6 space-y-3 text-[16px] leading-7">
            {reasons.map((reason) => (
              <li key={reason} className="flex gap-3">
                <span aria-hidden>✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-[120px]">
          <p className="text-[12px] tracking-[0.16em] text-gold uppercase">Complete Your Look</p>
          <h2 className="mt-3 font-serif text-[32px]">Intelligently selected</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {look.pieces.map((piece) => (
              <Link key={piece.product.id} href={`/product/${piece.product.id}`}>
                <img src={piece.product.images[0]} alt={piece.product.name} className="aspect-[3/4] w-full object-cover" />
                <p className="mt-3 text-[11px] tracking-[0.12em] uppercase">{piece.role}</p>
                <p className="mt-1 font-serif text-lg">{piece.product.name}</p>
              </Link>
            ))}
          </div>
          <Link href={`/look/${product.id}`} className="mt-10 inline-block text-[12px] tracking-[0.14em] uppercase">
            Open complete look →
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6">
      <dt className="text-secondary">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
