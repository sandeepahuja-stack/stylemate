"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AgentActivity } from "@/components/AgentActivity";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { PRODUCTS } from "@/domain/catalog";
import { parseIntent, intentToQuery } from "@/domain/profile";
import { resetCollection, searchProductsTool } from "@/domain/store";
import type { Category } from "@/domain/types";
import { useStylemate } from "@/domain/use-stylemate";

const FILTERS: { label: string; category?: Category }[] = [
  { label: "All", category: undefined },
  { label: "Shoes", category: "shoes" },
  { label: "Shirts", category: "shirts" },
  { label: "Trousers", category: "trousers" },
  { label: "Jackets", category: "jackets" },
  { label: "Suits", category: "suits" },
  { label: "Accessories", category: "accessories" },
];

function CollectionInner() {
  const params = useSearchParams();
  const { collectionResults, collectionQuery } = useStylemate();
  const [utterance, setUtterance] = useState("");
  const urlCategory = params.get("category") as Category | null;

  useEffect(() => {
    if (urlCategory) resetCollection({ category: urlCategory });
  }, [urlCategory]);

  const shown =
    urlCategory && collectionQuery.category !== urlCategory
      ? PRODUCTS.filter((p) => p.category === urlCategory)
      : collectionResults;

  function converse(text: string) {
    const intent = parseIntent(text);
    searchProductsTool(intentToQuery(intent));
    setUtterance("");
  }

  return (
    <>
      <SiteHeader active="Collection" />
      <AgentActivity />
      <main className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-16">
        <p className="text-[12px] font-semibold tracking-[0.15em] text-secondary uppercase">
          The Collection
        </p>
        <h1 className="mt-4 font-serif text-[40px] md:text-[56px]">A conversation with the rack.</h1>
        <p className="mt-4 max-w-xl font-light text-on-surface-variant">
          Speak to the edit. The collection will move. Manual filters remain, quietly, if you want them.
        </p>

        <form
          className="mt-12 max-w-2xl border-b border-outline-variant"
          toolname="searchProducts"
          tooldescription="Refine the live collection with a natural-language constraint."
          toolaction="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (utterance.trim()) converse(utterance);
          }}
        >
          <label htmlFor="collection-talk" className="sr-only">
            Refine the collection
          </label>
          <input
            id="collection-talk"
            value={utterance}
            onChange={(e) => setUtterance(e.target.value)}
            placeholder="Show me something more casual. Nothing too bright. Only leather."
            className="w-full border-0 bg-transparent py-4 text-[18px] font-light focus:ring-0 focus:outline-none"
          />
        </form>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const active = collectionQuery.category === filter.category;
            return (
              <button
                key={filter.label}
                onClick={() =>
                  filter.category
                    ? resetCollection({ category: filter.category })
                    : resetCollection({})
                }
                className={`px-4 py-2 text-[11px] tracking-[0.14em] uppercase ${
                  active ? "bg-primary text-on-primary" : "bg-surface-container text-primary"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <p className="mt-10 text-[11px] tracking-[0.12em] text-secondary uppercase">
            {shown.length} pieces in this edit
          </p>
          <div className="mt-10 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {shown.slice(0, 24).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export default function CollectionPage() {
  return (
    <Suspense>
      <CollectionInner />
    </Suspense>
  );
}
