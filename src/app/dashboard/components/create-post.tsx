"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useCreatePostMutation } from "@/hooks/use-posts";
import { Category, Tag } from "@/types/posts";

type PostFormData = {
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
  featuredImage: File | null;
};

export default function CreatePost({
  categories,
  tags,
}: {
  categories: Category[];
  tags: Tag[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    categoryId: "",
    tags: [],
    featuredImage: null,
  });
  const [errors, setErrors] = useState<Partial<PostFormData>>({});
  const { mutateAsync: createPost, isPending } = useCreatePostMutation();

  const validateForm = (): boolean => {
    const newErrors: Partial<PostFormData> = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.content.trim()) newErrors.content = "Le contenu est requis";
    if (!formData.categoryId) newErrors.categoryId = "Catégorie requise";
    if (
      formData.featuredImage &&
      formData.featuredImage.size > 5 * 1024 * 1024
    ) {
      newErrors.featuredImage = null;
      alert("L'image ne doit pas dépasser 5 Mo");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const form = new FormData();
    form.append("title", formData.title);
    form.append("content", formData.content);
    form.append("categoryId", formData.categoryId);
    formData.tags.forEach((tagId) => form.append("tags", tagId));
    if (formData.featuredImage) {
      form.append("featuredImage", formData.featuredImage);
    }

    try {
      await createPost(form);
      setFormData({
        title: "",
        content: "",
        categoryId: "",
        tags: [],
        featuredImage: null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "tags") {
      const selectedOptions = Array.from(
        (e.target as HTMLSelectElement).selectedOptions
      ).map((option) => option.value);
      setFormData((prev) => ({ ...prev, tags: selectedOptions }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof PostFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, featuredImage: file }));
    setErrors((prev) => ({ ...prev, featuredImage: undefined }));
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="ml-auto" variant="outline">
          <PlusIcon className="-ms-1 opacity-60" size={16} />
          Ajouter un post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Créer un nouveau post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <textarea
              name="content"
              rows={5}
              value={formData.content}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.content ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Catégorie *</Label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.categoryId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" disabled>
                -- Sélectionner --
              </option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-red-500">{errors.categoryId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag: Tag) => (
                <label key={tag.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={tag.id}
                    checked={formData.tags.includes(tag.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const tagId = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        tags: checked
                          ? [...prev.tags, tagId]
                          : prev.tags.filter((id) => id !== tagId),
                      }));
                    }}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Image à la une</Label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleFileChange}
              className={`w-full border p-2 rounded cursor-pointer ${
                errors.featuredImage ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.featuredImage && (
              <p className="text-sm text-red-500">
                {errors.featuredImage?.toString()}
              </p>
            )}
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Création..." : "Créer le post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
