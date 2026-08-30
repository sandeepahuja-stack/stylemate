"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AgentActivity } from "@/components/AgentActivity";
import { Button, ProductCard } from "@/components/ProductCard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { HERO_IDS, PRODUCTS } from "@/domain/catalog";
import { IMG } from "@/domain/images";
import { getProductById } from "@/domain/catalog";
import { DEMO_INTENT, runConsult } from "@/domain/store";

const CURATED = [
  HERO_IDS.loafer,
  HERO_IDS.shirt,
  HERO_IDS.suit,
  HERO_IDS.watch,
].map((id) => getProductById(id)!);

const CATEGORIES = [
  { label: "Shoes", href: "/collection?category=shoes", image: IMG.loafer },
  { label: "Shirting", href: "/collection?category=shirts", image: IMG.shirt },
  { label: "Tailoring", href: "/collection?category=suits", image: IMG.suit },
  { label: "Accessories", href: "/collection?category=accessories", image: IMG.watch },
];

export default function HomePage() {
  const router = useRouter();
  const [intent, setIntent] = useState(DEMO_INTENT);

  function findLook(text: string) {
    runConsult(text);
    router.push(`/stylist?intent=${encodeURIComponent(text)}`);
  }

  return (
    <>
      <SiteHeader />
      <AgentActivity />
      <main>
        <header className="relative flex h-[85vh] items-center justify-center overflow-hidden bg-surface-container">
          <img
            src={IMG.hero}
            alt="A cinematic fashion photograph of tailored clothing in warm editorial light"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/55 to-surface/25" />
          <div className="relative z-10 flex max-w-3xl flex-col items-center px-5 text-center">
            <h1 className="font-serif text-[48px] leading-[1.1] tracking-tight text-primary md:text-[80px] md:leading-[90px]">
              Your Style, Understood.
            </h1>
            <p className="mt-6 max-w-xl font-light text-[18px] leading-7 text-on-surface-variant">
              An intelligent private stylist that discovers what belongs in your wardrobe.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/stylist">
                <Button>Meet Your Stylist</Button>
              </Link>
              <Link href="/collection">
                <Button variant="ghost">Explore Collection</Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1440px] border-b border-outline-variant px-5 py-[120px] md:px-16">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <h2 className="font-serif text-[28px] md:text-[32px]">What are you dressing for?</h2>
            <form
              className="relative mt-8 w-full"
              toolname="getRecommendations"
              tooldescription="Start a private stylist consult from a natural-language dressing brief."
              toolaction="recommend"
              onSubmit={(e) => {
                e.preventDefault();
                findLook(intent);
              }}
            >
              <label htmlFor="brief" className="sr-only">
                Describe your occasion, mood, or specific needs
              </label>
              <textarea
                id="brief"
                rows={3}
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="Vintage date night. Black suit. Something understated."
                className="w-full resize-none border-0 border-b border-outline-variant bg-transparent p-4 text-[18px] font-light text-primary placeholder:text-outline focus:border-gold focus:ring-0 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Find my look"
                className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary hover:bg-surface-container-highest"
              >
                ↑
              </button>
            </form>
            <p className="mt-4 text-[11px] tracking-[0.12em] text-secondary uppercase">
              Describe your occasion, mood, or specific needs.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-[120px] md:px-16">
          <p className="text-[12px] font-semibold tracking-[0.15em] text-secondary uppercase">
            Curated For You
          </p>
          <h2 className="mt-4 font-serif text-[32px] md:text-[48px]">Four pieces. No more.</h2>
          <div className="mt-16 grid gap-10 md:grid-cols-4">
            {CURATED.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="bg-inverse-surface text-inverse-on-surface">
          <div className="mx-auto grid max-w-[1440px] gap-16 px-5 py-[120px] md:grid-cols-2 md:px-16">
            <div>
              <p className="text-[12px] font-semibold tracking-[0.15em] text-gold uppercase">
                The Private Stylist
              </p>
              <h2 className="mt-4 font-serif text-[40px] leading-tight md:text-[56px]">
                Don&apos;t search. Be understood.
              </h2>
              <p className="mt-6 max-w-md font-light text-[18px] leading-8 text-surface-container-highest">
                STYLEMATE learns preferred silhouettes, colors, brands, materials, previous likes,
                purchases, occasions, budget, and fit — then uses that intelligence inside the
                store.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-6 text-[14px] tracking-wide">
              {[
                "Preferred silhouettes",
                "Colors",
                "Materials",
                "Previous likes",
                "Previous purchases",
                "Occasions",
                "Budget",
                "Fit preferences",
              ].map((item) => (
                <li key={item} className="border-t border-white/15 pt-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-[120px] md:px-16">
          <p className="text-[12px] font-semibold tracking-[0.15em] text-gold uppercase">
            Complete The Look
          </p>
          <h2 className="mt-4 font-serif text-[32px] md:text-[48px]">A black suit, finished.</h2>
          <p className="mt-4 max-w-xl font-light text-on-surface-variant">
            Jacket. Shirt. Trousers. Shoes. Watch. Accessories — composed, not merchandised.
          </p>
          <Link href={`/look/${HERO_IDS.suit}`} className="mt-10 inline-block">
            <Button>View the look</Button>
          </Link>
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-5">
            {CURATED.concat(getProductById(HERO_IDS.belt)!).slice(0, 5).map((product) => (
              <div key={product.id} className="bg-surface-container">
                <img src={product.images[0]} alt={product.name} className="aspect-[3/4] w-full object-cover" />
                <p className="p-4 text-[12px] tracking-[0.1em] uppercase">{product.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-outline-variant px-5 py-[120px] md:px-16">
          <div className="mx-auto max-w-[1440px]">
            <h2 className="font-serif text-[32px] md:text-[48px]">The Collection</h2>
            <p className="mt-3 text-secondary">Editorial navigation. Never a warehouse.</p>
            <div className="mt-16 grid gap-4 md:grid-cols-4">
              {CATEGORIES.map((cat) => (
                <Link key={cat.label} href={cat.href} className="group relative block overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-6 font-serif text-[28px] text-on-primary">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-10 text-[12px] tracking-[0.12em] text-secondary uppercase">
              {PRODUCTS.length} pieces in the private edit
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
