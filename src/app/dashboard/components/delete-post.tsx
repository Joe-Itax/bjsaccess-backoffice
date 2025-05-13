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
import { TrashIcon } from "lucide-react";
import { Post } from "@/types/posts";
import { useDeletePostMutation } from "@/hooks/use-posts";

interface DeleteUserProps {
  post: Post;
}

export default function DeletePost({ post }: DeleteUserProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const deletePostMutation = useDeletePostMutation();

  const handleDeletePost = async () => {
    try {
      if (post?.id) {
        await deletePostMutation.mutateAsync(post.id);
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
          <TrashIcon /> Supprimer
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirmer la suppression de l&apos;article
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
            disabled={deletePostMutation.isPending}
            variant="destructive"
          >
            {deletePostMutation.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
