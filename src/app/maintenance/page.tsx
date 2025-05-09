"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Maintenance() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-3xl font-bold text-red-600">
        Maintenance en cours 🚧
      </h1>
      <p className="text-muted-foreground max-w-md text-sm">
        Nous effectuons une petite maintenance. Merci de réessayer dans quelques
        minutes !
      </p>
      <Button
        variant="default"
        onClick={() => router.refresh()}
        className="mt-4"
      >
        Réessayer
      </Button>
    </div>
  );
}
