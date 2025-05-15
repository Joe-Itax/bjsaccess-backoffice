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
import { Trash2Icon } from "lucide-react";
import {  Tag } from "@/types/posts";
import {  useDeleteTagMutation } from "@/hooks/use-posts";

interface DeleteTagProps {
  tag: Tag;
}

export default function DeleteTag({ tag }: DeleteTagProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const deleteTagMutation = useDeleteTagMutation();

  const handleDeletePost = async () => {
    try {
      if (tag?.id) {
        await deleteTagMutation.mutateAsync({ tagId: tag.id });
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
        <Button variant={"ghost"}>
          <Trash2Icon className="text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirmer la suppression du tag
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est{" "}
            <span className="text-red-600 font-semibold">irréversible</span>.
            <span className="mt-2"> Souhaitez-vous vraiment continuer ?</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button
            onClick={handleDeletePost}
            disabled={deleteTagMutation.isPending}
            variant="destructive"
          >
            {deleteTagMutation.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
