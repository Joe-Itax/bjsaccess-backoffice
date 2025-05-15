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
import { Category } from "@/types/posts";
import { useDeleteCategoryMutation } from "@/hooks/use-posts";

interface DeleteCategoryProps {
  category: Category;
}

export default function DeleteCategory({ category }: DeleteCategoryProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const deleteCategoryMutation = useDeleteCategoryMutation();

  const handleDeletePost = async () => {
    try {
      if (category?.id) {
        await deleteCategoryMutation.mutateAsync({ categoryId: category.id });
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
            Confirmer la suppression de la categorie
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
            disabled={deleteCategoryMutation.isPending}
            variant="destructive"
          >
            {deleteCategoryMutation.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
