"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSkeleton } from "@/app/dashboard/skeleton";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return <DashboardSkeleton />;
}
