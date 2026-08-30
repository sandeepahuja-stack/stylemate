"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AgentActivity } from "@/components/AgentActivity";
import { Button } from "@/components/ProductCard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { buildOutfit } from "@/domain/outfit";
import { checkInventory } from "@/domain/inventory";
import { addToCart } from "@/domain/store";

export default function LookPage() {
  const { id } = useParams<{ id: string }>();
  const outfit = buildOutfit(id);
  const [inventoryNote, setInventoryNote] = useState("Stylist is checking inventory...");

  useEffect(() => {
    const pieces = buildOutfit(id).pieces;
    const timer = setTimeout(() => {
      const all = pieces.every((p) => checkInventory(p.product.id).available);
      setInventoryNote(all ? "All items available in your sizes" : "A piece is on waitlist");
    }, 900);
    return () => clearTimeout(timer);
  }, [id]);

  return (
    <>
      <SiteHeader active="Stylist" />
      <AgentActivity />
      <main className="mx-auto w-full max-w-[1440px] px-5 py-[80px] md:px-16">
        <section className="grid gap-10 md:grid-cols-12">
          <div className="relative md:col-span-7">
            <img
              src={outfit.pieces[0].product.images[0]}
              alt={outfit.pieces[0].product.name}
              className="h-[70vh] w-full object-cover"
            />
            <div className="absolute bottom-6 left-6 max-w-xs border border-outline-variant/30 bg-surface/90 p-4 backdrop-blur-sm">
              <p className="text-[11px] tracking-[0.14em] text-on-surface-variant uppercase">The Anchor</p>
              <h1 className="mt-1 font-serif text-[28px]">{outfit.pieces[0].product.name}</h1>
              <p className="mt-2 text-sm text-secondary">{outfit.pieces[0].product.craftsmanship}.</p>
            </div>
          </div>
          <div className="flex flex-col justify-center md:col-span-5 md:pl-8">
            <p className="text-[12px] tracking-[0.16em] text-gold uppercase">Stylist Curated</p>
            <h2 className="mt-4 font-serif text-[40px] leading-tight">Complete The Look.</h2>
            <p className="mt-6 font-light text-[18px] leading-8 text-secondary">{outfit.why}</p>
            <p className="mt-8 border border-outline-variant/30 bg-surface-container-low p-4 text-[11px] tracking-[0.14em] uppercase">
              {inventoryNote}
            </p>
          </div>
        </section>

        <section className="mt-[120px]">
          <h3 className="mb-12 text-center font-serif text-[32px]">The Interplay of Texture</h3>
          <div className="grid gap-px bg-outline-variant/30 md:grid-cols-3">
            {outfit.pieces.slice(1).map((piece, index) => (
              <article key={piece.product.id} className="group relative aspect-[4/5] overflow-hidden bg-surface">
                <img
                  src={piece.product.images[0]}
                  alt={piece.product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/55 to-transparent p-6 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100">
                  <p className="text-[10px] tracking-[0.14em] text-on-primary uppercase">
                    0{index + 1} / {piece.role}
                  </p>
                  <h4 className="mt-2 font-serif text-2xl text-on-primary">{piece.product.name}</h4>
                  <p className="mt-2 text-sm text-on-primary/80">{piece.note}</p>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => addToCart(piece.product.id)}
                  >
                    Add to Curated Selection
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 max-w-2xl">
          <h3 className="font-serif text-[28px]">Why this works</h3>
          <p className="mt-4 font-light leading-8 text-secondary">{outfit.why}</p>
          <Link href={`/product/${outfit.pieces[0].product.id}`} className="mt-8 inline-block">
            <Button variant="ghost">Return to the anchor</Button>
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
