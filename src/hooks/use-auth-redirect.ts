"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthUserQuery } from "./use-auth-user";

export function useAuthRedirect({
  ifAuthenticated,
  ifUnauthenticated,
}: {
  ifAuthenticated?: string;
  ifUnauthenticated?: string;
}) {
  const router = useRouter();
  const { data: user, isLoading } = useAuthUserQuery();

  useEffect(() => {
    if (isLoading) return;

    if (user && ifAuthenticated) {
      router.replace(ifAuthenticated);
    }

    if (!user && ifUnauthenticated) {
      router.replace(ifUnauthenticated);
    }
  }, [user, isLoading, ifAuthenticated, ifUnauthenticated, router]);

  return { user, isLoading };
}
