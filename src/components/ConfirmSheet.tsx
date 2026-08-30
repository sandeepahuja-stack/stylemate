"use client";

import { useEffect, useRef } from "react";
import { cancelPending, confirmPending } from "@/domain/store";
import { useStylemate } from "@/domain/use-stylemate";
import { formatPrice } from "@/lib/format";
import { Button } from "./ProductCard";

export function ConfirmSheet() {
  const { pendingConfirmation } = useStylemate();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (pendingConfirmation) closeRef.current?.focus();
  }, [pendingConfirmation]);

  if (!pendingConfirmation) return null;

  const copy = copyFor(pendingConfirmation);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-surface/80 px-5 backdrop-blur-sm"
      role="presentation"
      onClick={cancelPending}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md border border-outline-variant bg-surface p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="font-serif text-[28px] leading-tight">
          {copy.title}
        </h2>
        <p className="mt-4 whitespace-pre-line text-[16px] leading-7 text-secondary">{copy.body}</p>
        <div className="mt-8 flex gap-4">
          <Button variant="ghost" className="flex-1" onClick={cancelPending} ref={closeRef}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => confirmPending()}>
            {copy.confirm}
          </Button>
        </div>
      </div>
    </div>
  );
}

function copyFor(pending: NonNullable<ReturnType<typeof useStylemate>["pendingConfirmation"]>) {
  if (pending.kind === "add_to_cart") {
    return {
      title: "STYLEMATE wants to add",
      body: `${pending.name}\nSize ${pending.size}\n${formatPrice(pending.price)}`,
      confirm: "Add to Cart",
    };
  }
  if (pending.kind === "add_to_wardrobe") {
    return {
      title: "Add to wardrobe?",
      body: `${pending.name} will be kept in your private wardrobe.`,
      confirm: "Add to Wardrobe",
    };
  }
  if (pending.kind === "apply_coupon") {
    return {
      title: "Apply courtesy?",
      body: pending.label,
      confirm: "Apply",
    };
  }
  if (pending.kind === "place_order") {
    return {
      title: "Place this order?",
      body: `Total ${formatPrice(pending.total)}. Payment is never taken without you.`,
      confirm: "Acknowledge",
    };
  }
  if (pending.kind === "change_address") {
    return {
      title: "Change delivery address?",
      body: pending.address,
      confirm: "Confirm address",
    };
  }
  if (pending.kind === "payment") {
    return {
      title: "Proceed to payment?",
      body: `Total ${formatPrice(pending.total)}. This preview never captures a card.`,
      confirm: "Acknowledge",
    };
  }
  return {
    title: "Please confirm",
    body: "This action needs you.",
    confirm: "Confirm",
  };
}
