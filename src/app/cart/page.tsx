"use client";

import Link from "next/link";
import { AgentActivity } from "@/components/AgentActivity";
import { Button, ProductCard } from "@/components/ProductCard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { getProductDetails } from "@/domain/search";
import { cartTotal, placeOrder, updateCart } from "@/domain/store";
import { cartSuggestion } from "@/domain/store";
import { useStylemate } from "@/domain/use-stylemate";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { cart } = useStylemate();
  const suggestion = cartSuggestion();
  const total = cartTotal(cart);

  return (
    <>
      <SiteHeader />
      <AgentActivity />
      <main className="mx-auto w-full max-w-3xl px-5 py-16 md:px-16">
        <h1 className="font-serif text-[48px]">Your wardrobe, waiting.</h1>
        {cart.length === 0 ? (
          <p className="mt-8 text-secondary">Nothing is reserved yet. Begin with a brief.</p>
        ) : (
          <ul className="mt-12 divide-y border-y border-outline-variant">
            {cart.map((item) => {
              const product = getProductDetails(item.productId);
              return (
                <li key={`${item.productId}-${item.size}`} className="flex gap-6 py-8">
                  <img src={product.images[0]} alt="" className="h-32 w-24 object-cover" />
                  <div className="flex-1">
                    <p className="font-serif text-2xl">{product.name}</p>
                    <p className="mt-1 text-sm text-secondary">Size {item.size}</p>
                    <p className="mt-2">{formatPrice(product.price)}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <label className="text-[11px] tracking-[0.12em] uppercase">
                        Quantity
                        <input
                          type="number"
                          min={0}
                          value={item.quantity}
                          onChange={(e) =>
                            updateCart(item.productId, item.size, Number(e.target.value))
                          }
                          className="ml-3 w-16 border-b border-outline-variant bg-transparent py-1"
                        />
                      </label>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {suggestion ? (
          <section className="mt-16">
            <p className="text-[12px] tracking-[0.16em] text-gold uppercase">Complete your look</p>
            <p className="mt-3 max-w-md font-light text-on-surface-variant">
              You have the shoes. Add this cream shirt to complete the outfit?
            </p>
            <div className="mt-8 max-w-xs">
              <ProductCard product={suggestion} />
            </div>
          </section>
        ) : null}

        {cart.length > 0 ? (
          <div className="mt-16 flex items-center justify-between border-t border-outline-variant pt-8">
            <p className="font-serif text-2xl">{formatPrice(total)}</p>
            <Button onClick={() => placeOrder()}>Place order</Button>
          </div>
        ) : (
          <Link href="/stylist" className="mt-10 inline-block">
            <Button>Meet Your Stylist</Button>
          </Link>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
