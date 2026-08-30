"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ConfirmSheet } from "@/components/ConfirmSheet";
import { WebMcpRegistrar } from "@/webmcp/register";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <WebMcpRegistrar />
      {children}
      <ConfirmSheet />
    </QueryClientProvider>
  );
}
