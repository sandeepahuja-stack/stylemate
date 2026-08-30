"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AgentActivity } from "@/components/AgentActivity";
import { Button } from "@/components/ProductCard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { compareProducts } from "@/domain/compare";
import { addToCart } from "@/domain/store";
import { useStylemate } from "@/domain/use-stylemate";

function CompareInner() {
  const params = useSearchParams();
  const { compareIds, lastIntent, profile } = useStylemate();
  const ids = (params.get("ids")?.split(",") || compareIds).filter(Boolean);
  if (ids.length < 2) {
    return (
      <>
        <SiteHeader />
        <main className="px-5 py-24 text-center">Ask the stylist to compare two or three pieces.</main>
      </>
    );
  }

  const result = compareProducts(ids, profile, lastIntent);

  return (
    <>
      <SiteHeader active="Stylist" />
      <AgentActivity />
      <main className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-16">
        <p className="text-[12px] tracking-[0.16em] text-gold uppercase">Product comparison</p>
        <h1 className="mt-3 font-serif text-[40px]">Three candidates. One verdict.</h1>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="py-4 font-normal text-secondary"> </th>
                {result.products.map((product) => (
                  <th key={product.id} className="px-4 py-4">
                    <img src={product.images[0]} alt="" className="mb-4 h-40 w-full object-cover" />
                    <span className="font-serif text-xl">{product.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.key} className="border-b border-outline-variant/70">
                  <th className="py-4 pr-4 text-secondary font-normal">{row.label}</th>
                  {result.products.map((product) => (
                    <td
                      key={product.id}
                      className={`px-4 py-4 ${product.id === result.winnerId && row.key === "match" ? "text-gold-deep" : ""}`}
                    >
                      {row.values[product.id]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <section className="mt-16 max-w-2xl">
          <p className="text-[12px] tracking-[0.16em] text-gold uppercase">Stylist&apos;s Verdict</p>
          <p className="mt-4 font-serif text-[28px] leading-snug">{result.verdict}</p>
          <Button className="mt-8" onClick={() => addToCart(result.winnerId)}>
            Add the recommended piece
          </Button>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareInner />
    </Suspense>
  );
}
