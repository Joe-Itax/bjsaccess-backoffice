"use client";

import { getQueryClient } from "./react-query-client";

export function revalidateAuthUser() {
  getQueryClient().invalidateQueries({ queryKey: ["auth-user"] });
}
