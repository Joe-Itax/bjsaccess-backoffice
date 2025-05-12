"use client";

import { useState } from "react";
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
import { useDeleteUserMutation } from "@/hooks/use-users";
import { User } from "@/types/user";
import { TrashIcon } from "lucide-react";

interface DeleteUserProps {
  user: User;
}

export default function DeleteUser({ user }: DeleteUserProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const deleteUserMutation = useDeleteUserMutation();

  const handleDeleteUser = async () => {
    try {
      if (user?.id) {
        await deleteUserMutation.mutateAsync(user.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpenDialog(false);
    }
  };
  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} className="border-red-500">
          Supprimer définitivement <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirmer la suppression définitive
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est{" "}
            <span className="text-red-600 font-semibold">irréversible</span>. En
            supprimant{" "}
            <b>
              {user.name} ({user.role})
            </b>{" "}
            :
            <span className="mt-2 list-disc list-inside space-y-1">
              <li>
                Tous ses <b>articles</b> seront supprimés
              </li>
              <li>
                Tous les <b>commentaires</b> liés à ses articles seront
                supprimés
              </li>
              <li>
                Ses <b>commentaires visiteurs</b> seront supprimés
              </li>
              <li>
                Ses <b>tokens d’authentification</b> seront révoqués
              </li>
              <li>
                Toutes les <b>relations de tags</b> avec ses articles seront
                supprimées
              </li>
            </span>
            <span className="mt-2">Souhaitez-vous vraiment continuer ?</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button
            onClick={handleDeleteUser}
            disabled={deleteUserMutation.isPending}
            variant="destructive"
          >
            {deleteUserMutation.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
