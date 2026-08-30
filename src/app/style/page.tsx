"use client";

import { useState } from "react";
import { AgentActivity } from "@/components/AgentActivity";
import { Button } from "@/components/ProductCard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { IMG } from "@/domain/images";
import { updateProfile } from "@/domain/store";
import { useStylemate } from "@/domain/use-stylemate";

const COLOR_SWATCHES: Record<string, string> = {
  Black: "#1c1c17",
  Burgundy: "#4a1c24",
  "Earth tones": "#a17f3b",
  Cream: "#f2ede6",
  "Deep navy": "#1b2430",
};

export default function StylePage() {
  const { profile } = useStylemate();
  const [editing, setEditing] = useState(false);
  const [identity, setIdentity] = useState(profile.identity);

  return (
    <>
      <SiteHeader active="Wardrobe" />
      <AgentActivity />
      <div className="mx-auto flex w-full max-w-[1440px] flex-1">
        <aside className="sticky top-20 hidden h-[calc(100vh-80px)] w-[300px] shrink-0 border-r border-outline-variant p-6 md:block">
          <h2 className="mt-8 font-serif text-[32px]">AI Concierge</h2>
          <p className="mt-2 text-secondary">Your personal aesthetic agent is active.</p>
          <nav className="mt-10 space-y-2 text-[16px]">
            <a className="block px-2 py-2 text-secondary" href="/stylist">
              Concierge
            </a>
            <a className="block px-2 py-2 text-secondary" href="/collection">
              Inventory
            </a>
            <span className="block border-r-2 border-primary bg-surface-bright px-2 py-2">Preferences</span>
            <span className="block px-2 py-2 text-secondary">History</span>
          </nav>
        </aside>

        <main className="flex-1 px-5 py-16 md:px-16">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-[12px] tracking-[0.16em] text-secondary uppercase">Private Client</p>
              <h1 className="mt-3 font-serif text-[48px] md:text-[80px]">Style Profile</h1>
              <p className="mt-4 text-[18px] font-light text-secondary">
                Identity: <span className="text-primary">{profile.identity}</span>
              </p>
            </div>
            <Button variant="ghost" onClick={() => setEditing((v) => !v)}>
              {editing ? "Close" : "Edit Preferences"}
            </Button>
          </div>

          {editing ? (
            <form
              className="mt-12 max-w-lg"
              onSubmit={(e) => {
                e.preventDefault();
                updateProfile({ identity });
                setEditing(false);
              }}
            >
              <label htmlFor="identity" className="text-[12px] tracking-[0.14em] uppercase">
                Style identity
              </label>
              <input
                id="identity"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                className="mt-2 w-full border-0 border-b border-outline-variant bg-transparent py-3 focus:border-gold focus:outline-none"
              />
              <Button className="mt-6" type="submit">
                Save
              </Button>
            </form>
          ) : null}

          <div className="mt-[80px] grid gap-10 md:grid-cols-12">
            <section className="md:col-span-4">
              <h3 className="border-b border-outline-variant pb-2 text-[12px] tracking-[0.16em] text-secondary uppercase">
                Preferred Colors
              </h3>
              <div className="mt-6 flex gap-4">
                {profile.preferredColors.map((color) => (
                  <div
                    key={color}
                    title={color}
                    className="h-12 w-12 rounded-full border border-outline-variant"
                    style={{ background: COLOR_SWATCHES[color] ?? "#5e5f5c" }}
                  />
                ))}
              </div>
            </section>
            <section className="md:col-span-8">
              <h3 className="border-b border-outline-variant pb-2 text-[12px] tracking-[0.16em] text-secondary uppercase">
                Preferred silhouettes
              </h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {profile.preferredSilhouettes.map((item) => (
                  <span key={item} className="border border-outline-variant bg-surface-container px-6 py-3">
                    {item}
                  </span>
                ))}
              </div>
            </section>
            <section className="md:col-span-6">
              <h3 className="border-b border-outline-variant pb-2 text-[12px] tracking-[0.16em] text-secondary uppercase">
                Preferred materials
              </h3>
              <ul className="mt-6 space-y-3">
                {profile.preferredMaterials.map((item) => (
                  <li key={item} className="flex justify-between text-[18px] font-light">
                    <span>{item}</span>
                    <span className="text-sm text-secondary">Preferred</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="md:col-span-6">
              <h3 className="border-b border-outline-variant pb-2 text-[12px] tracking-[0.16em] text-secondary uppercase">
                Occasions
              </h3>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {profile.occasions.map((item) => (
                  <div key={item} className="flex aspect-square items-center justify-center border border-outline-variant bg-surface-container p-4 text-center">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <p className="mt-10 text-sm text-secondary">
            Budget preference: ₹{profile.budgetMin.toLocaleString("en-IN")} – ₹
            {profile.budgetMax.toLocaleString("en-IN")}
          </p>

          <section className="mt-[80px]">
            <h3 className="border-b border-outline-variant pb-4 text-[12px] tracking-[0.16em] text-secondary uppercase">
              Style Evolution
            </h3>
            <div className="relative mt-6 flex h-64 items-end border border-outline-variant bg-surface-container px-8 py-4">
              {profile.evolution.map((point) => (
                <div key={point.year} className="flex h-full flex-1 flex-col justify-end px-2">
                  <div
                    className="bg-primary/80"
                    style={{ height: `${point.intensity}%` }}
                    title={point.note}
                  />
                  <p className="mt-2 text-[11px] text-secondary">{point.year}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-[80px]">
            <h3 className="border-b border-outline-variant pb-4 text-[12px] tracking-[0.16em] text-secondary uppercase">
              Current Moodboard
            </h3>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[IMG.mood1, IMG.mood2, IMG.look, IMG.editorial].map((src) => (
                <div key={src} className="aspect-[3/4] bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
              ))}
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
