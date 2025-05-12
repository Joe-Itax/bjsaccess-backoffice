"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeactivateUserMutation } from "@/hooks/use-users";
import { User } from "@/types/user";
import { useState } from "react";

interface DeactiveUserProps {
  row: { original: User };
}

export default function DeactiveUser({ row }: DeactiveUserProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const deactivateUsersMutation = useDeactivateUserMutation();

  const handleDeactivateUsers = async () => {
    try {
      await deactivateUsersMutation.mutateAsync([row.original.id]);
    } catch (error) {
      console.error("Erreur lors de la désactivation de l'utilisateur:", error);
    } finally {
      setOpenDialog(false);
    }
  };

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={(e) => e.preventDefault()}
        >
          <span>Désactiver l&apos;utilisateur</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la désactivation</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir désactiver{" "}
            <b>
              {row.original.name} ({row.original.role}){" "}
            </b>
            du back-office ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button
            onClick={handleDeactivateUsers}
            disabled={deactivateUsersMutation.isPending}
            variant="destructive"
          >
            {deactivateUsersMutation.isPending
              ? "Désactivation..."
              : "Désactiver"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
