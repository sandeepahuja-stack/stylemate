"use client";

import { useSyncExternalStore } from "react";
import { getState, subscribe } from "@/domain/store";
import type { AppState } from "@/domain/types";

export function useStylemate(): AppState {
  return useSyncExternalStore(subscribe, getState, getState);
}
