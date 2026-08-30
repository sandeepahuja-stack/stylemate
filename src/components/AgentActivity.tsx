"use client";

import { useStylemate } from "@/domain/use-stylemate";

export function AgentActivity() {
  const { agentActivity } = useStylemate();
  const latest = agentActivity[0];
  if (!latest) return null;

  return (
    <div
      className="border-b border-outline-variant bg-surface-container-low"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-5 py-2 md:px-16">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        <p className="text-[11px] tracking-[0.14em] text-secondary uppercase">
          {latest.tool} — {latest.detail}
        </p>
      </div>
    </div>
  );
}
