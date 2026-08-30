"use client";

import Link from "next/link";
import { useStylemate } from "@/domain/use-stylemate";

const LINKS = [
  { href: "/style", label: "Wardrobe" },
  { href: "/stylist", label: "Stylist" },
  { href: "/collection", label: "Collection" },
];

export function SiteHeader({ active }: { active?: string }) {
  const { cart } = useStylemate();
  const count = cart.reduce((n, item) => n + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-5 md:px-16">
        <Link
          href="/"
          className="font-serif text-[28px] leading-none tracking-tight text-primary md:text-[32px]"
        >
          STYLEMATE
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map((link) => {
            const isActive = active === link.label;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-[12px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${
                  isActive
                    ? "border-b border-gold pb-1 text-gold-deep"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-5">
          <Link href="/style" aria-label="Private client profile" className="text-primary hover:text-gold">
            <PersonIcon />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative text-primary hover:text-gold">
            <BagIcon />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] text-surface">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}

function PersonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M5 19.2c1.6-3.2 4-4.7 7-4.7s5.4 1.5 7 4.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6.5 8.5h11l.8 11.2H5.7L6.5 8.5Z" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9 8.5V7.2A3 3 0 0 1 12 4.2 3 3 0 0 1 15 7.2v1.3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-outline-variant bg-surface-container-highest">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-8 px-5 py-12 md:flex-row md:px-16">
        <p className="font-serif text-[28px] tracking-tight">STYLEMATE</p>
        <nav className="flex flex-wrap justify-center gap-6">
          {["Sustainability", "Atelier Services", "Privacy", "Contact"].map((item) => (
            <span key={item} className="text-[11px] uppercase tracking-[0.12em] text-secondary">
              {item}
            </span>
          ))}
        </nav>
        <p className="text-[11px] tracking-[0.08em] text-secondary">
          © 2026 STYLEMATE. THE PRIVATE CLIENT EXPERIENCE.
        </p>
      </div>
    </footer>
  );
}
