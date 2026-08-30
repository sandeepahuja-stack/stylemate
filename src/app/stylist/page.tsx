"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AgentActivity } from "@/components/AgentActivity";
import { Button } from "@/components/ProductCard";
import { SiteHeader } from "@/components/SiteChrome";
import { addToCart, addToWishlist, compareProductsTool, runConsult } from "@/domain/store";
import { useStylemate } from "@/domain/use-stylemate";
import { formatPrice } from "@/lib/format";

function StylistInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { stylistMessages, recommendations, lastIntent, profile } = useStylemate();
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const fromUrl = params.get("intent");
    if (fromUrl && fromUrl !== lastIntent) {
      runConsult(fromUrl);
    }
  }, [params, lastIntent]);

  function send() {
    if (!draft.trim()) return;
    runConsult(draft.trim());
    setDraft("");
  }

  const top = recommendations[0];
  const rest = recommendations.slice(1);

  return (
    <>
      <SiteHeader active="Stylist" />
      <AgentActivity />
      <div className="flex flex-1">
        <main className="flex-1 px-5 py-16 pb-32 md:px-16 md:pr-[430px]">
          <div className="mx-auto max-w-3xl space-y-16">
            <p className="border-b border-outline-variant pb-4 text-center text-[11px] tracking-[0.16em] text-secondary uppercase">
              STYLEMATE PRIVATE STYLIST
              {lastIntent ? " — Active session" : ""}
            </p>

            {stylistMessages.length === 0 ? (
              <div className="text-center">
                <h1 className="font-serif text-[32px] md:text-[48px]">Your personal aesthetic agent is active.</h1>
                <p className="mt-4 font-light text-on-surface-variant">
                  Tell me what you&apos;re dressing for. I already know you as a {profile.identity}.
                </p>
              </div>
            ) : null}

            {stylistMessages.map((message) => (
              <div key={message.id}>
                {message.role === "client" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] border border-outline-variant/40 bg-surface-container-highest px-6 py-4">
                      <p>{message.text}</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[90%] space-y-6">
                    <h2 className="font-serif text-[28px] leading-tight md:text-[32px]">
                      {/suit/.test(lastIntent.toLowerCase())
                        ? "The subtle art of down-dressing a black suit."
                        : "A considered edit for this brief."}
                    </h2>
                    <div className="whitespace-pre-line font-light text-[18px] leading-8 text-on-surface-variant">
                      {message.text}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {top ? (
              <article className="overflow-hidden border border-outline-variant/50 bg-surface-container">
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-1/2">
                    <img
                      src={top.product.images[0]}
                      alt={top.product.name}
                      className="h-80 w-full object-cover"
                    />
                    <span className="absolute left-4 top-4 border border-outline-variant bg-surface px-3 py-1 text-[11px] tracking-[0.12em] uppercase">
                      {top.match}% Style Match
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-8">
                    <div>
                      <p className="text-[11px] tracking-[0.14em] text-secondary uppercase">
                        Primary recommendation
                      </p>
                      <h3 className="mt-2 font-serif text-[28px]">{top.product.name}</h3>
                      <p className="mt-2 text-sm">{formatPrice(top.product.price)}</p>
                      <p className="mt-4 text-[15px] leading-7 text-on-surface-variant">
                        {top.reasons[0] ?? top.product.description}
                      </p>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3 border-t border-outline-variant pt-6">
                      <Link href={`/product/${top.product.id}`}>
                        <Button variant="ghost">View Details</Button>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const ids = recommendations.slice(0, 3).map((r) => r.product.id);
                          compareProductsTool(ids);
                          router.push(`/compare?ids=${ids.join(",")}`);
                        }}
                      >
                        Compare
                      </Button>
                      <Button onClick={() => addToWishlist(top.product.id)}>Add to Wardrobe</Button>
                    </div>
                  </div>
                </div>
              </article>
            ) : null}

            {rest.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {rest.map((rec) => (
                  <article key={rec.product.id} className="border border-outline-variant/50 bg-surface-container">
                    <img src={rec.product.images[0]} alt={rec.product.name} className="aspect-square w-full object-cover" />
                    <div className="p-6">
                      <p className="text-[11px] tracking-[0.12em] uppercase">{rec.match}% match</p>
                      <h3 className="mt-2 font-serif text-[22px]">{rec.product.name}</h3>
                      <p className="mt-1 text-sm">{formatPrice(rec.product.price)}</p>
                      <p className="mt-3 text-sm text-on-surface-variant">{rec.reasons[0]}</p>
                      <div className="mt-4 flex gap-3">
                        <Link href={`/product/${rec.product.id}`} className="text-[11px] tracking-[0.14em] uppercase">
                          View Details
                        </Link>
                        <button
                          className="text-[11px] tracking-[0.14em] uppercase"
                          onClick={() => addToCart(rec.product.id)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </main>

        <aside className="fixed right-0 top-0 hidden h-full w-[400px] border-l border-outline-variant bg-surface-container px-6 pt-28 md:flex md:flex-col">
          <p className="text-[12px] font-semibold tracking-[0.16em] text-gold uppercase">AI Concierge</p>
          <h2 className="mt-3 font-serif text-[28px]">Your personal aesthetic agent is active.</h2>
          <p className="mt-4 text-sm text-secondary">
            Tools run on the same atelier state as this page. Nothing consequential happens without you.
          </p>
          <nav className="mt-10 flex flex-col gap-2 text-[16px]">
            <Link href="/stylist" className="border-r-2 border-primary bg-surface-bright px-4 py-3">
              Concierge
            </Link>
            <Link href="/collection" className="px-4 py-3 text-secondary hover:bg-surface-bright">
              Inventory
            </Link>
            <Link href="/style" className="px-4 py-3 text-secondary hover:bg-surface-bright">
              Preferences
            </Link>
            <Link href="/style" className="px-4 py-3 text-secondary hover:bg-surface-bright">
              History
            </Link>
          </nav>
          <button
            className="mt-auto mb-8 w-full border border-outline-variant py-4 text-[12px] tracking-[0.14em] uppercase"
            onClick={() => runConsult("I have a vintage-style date and I'll be wearing a black suit.")}
          >
            Start New Consult
          </button>
        </aside>
      </div>

      <form
        className="fixed bottom-0 left-0 z-30 w-full border-t border-outline-variant bg-surface p-4 md:w-[calc(100%-400px)]"
        toolname="getRecommendations"
        tooldescription="Ask the private stylist to refine recommendations from a dressing brief."
        toolaction="recommend"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <div className="relative mx-auto max-w-3xl">
          <label htmlFor="stylist-input" className="sr-only">
            Ask your stylist
          </label>
          <input
            id="stylist-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask your stylist..."
            className="w-full rounded-full border-0 bg-surface-container-highest py-4 pr-16 pl-6 focus:ring-1 focus:ring-outline-variant focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Send"
            className="absolute top-1/2 right-4 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-on-primary"
          >
            ↑
          </button>
        </div>
      </form>
    </>
  );
}

export default function StylistPage() {
  return (
    <Suspense>
      <StylistInner />
    </Suspense>
  );
}
