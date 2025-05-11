import { Button } from "@/components/ui/button";
import {  useUsersQuery } from "@/hooks/use-users";
import { CircleAlertIcon } from "lucide-react";

export default function ErrorThenRefresh() {
  const { isError, refetch } = useUsersQuery();
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <CircleAlertIcon className="text-destructive" size={48} />
      <h3 className="text-xl font-semibold">Erreur de chargement</h3>
      <p className="text-muted-foreground">{isError}</p>
      <Button
        onClick={async () => {
          await refetch();
        }}
      >
        Réessayer
      </Button>
    </div>
  );
}
