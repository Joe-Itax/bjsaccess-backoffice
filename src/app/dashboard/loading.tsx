"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-10 w-40 rounded-md" />
        <Skeleton className="h-4 w-64 rounded-md" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-80 rounded-md" />
        <Skeleton className="h-6 w-72 rounded-md" />
        <Skeleton className="h-6 w-60 rounded-md" />
      </div>
    </div>
  );
}
