"use client";

import { useTokenRefresher } from "@/hooks/use-token-refresher";

export function TokenRefresher() {
  useTokenRefresher();
  return null;
}
