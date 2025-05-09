"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold text-red-600">
        Oups ! Une erreur est survenue.
      </h2>
      <p className="text-muted-foreground max-w-md text-sm">
        Il semble que quelque chose se soit mal passé. Veuillez essayer de
        recharger la page.
      </p>
      <Button variant="outline" onClick={reset} className="mt-4">
        Réessayer
      </Button>
    </div>
  );
}
