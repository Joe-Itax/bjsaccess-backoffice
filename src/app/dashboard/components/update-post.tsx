// "use client";

// import { useState } from "react";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { PencilLineIcon } from "lucide-react";
// import { useUpdatePostMutation } from "@/hooks/use-posts";
// import { Post } from "@/types/posts";

// interface UpdatePostProps {
//   post: Post;
//   categories: Array<{ id: string; name: string }>;
//   tags: Array<{ id: string; name: string }>;
// }

// type PostFormData = {
//   title: string;
//   content: string;
//   featuredImage?: string;
//   published: boolean;
//   categoryId: string;
//   tagIds: string[];
// };

// export default function UpdatePost({
//   post,
//   categories,
//   tags,
// }: UpdatePostProps) {
//   const [openDialog, setOpenDialog] = useState(false);

//   const { mutateAsync: updatePostMutation, isPending } =
//     useUpdatePostMutation();

//   const [formData, setFormData] = useState<PostFormData>({
//     title: post.title,
//     content: post.content,
//     featuredImage: post.featuredImage || "",
//     published: post.published,
//     categoryId: post.category.id,
//     tagIds: post.tags?.map((tag) => tag.id) || [],
//   });
//   const [errors, setErrors] = useState<Partial<PostFormData>>({});

//   const validateForm = (): boolean => {
//     const newErrors: Partial<PostFormData> = {};

//     if (!formData.title.trim()) newErrors.title = "Le titre est requis";
//     if (!formData.content.trim()) newErrors.content = "Le contenu est requis";
//     if (!formData.categoryId) newErrors.categoryId = "La catégorie est requise";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       await updatePostMutation({
//         id: post.id,
//         ...formData,
//       });
//       setOpenDialog(false);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value, type } = e.target as HTMLInputElement;

//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     }));

//     if (errors[name as keyof PostFormData]) {
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleTagChange = (tagId: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       tagIds: prev.tagIds.includes(tagId)
//         ? prev.tagIds.filter((id) => id !== tagId)
//         : [...prev.tagIds, tagId],
//     }));
//   };

//   return (
//     <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <PencilLineIcon className="mr-2 h-4 w-4" />
//           Modifier
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader className="border-b px-6 py-4">
//           <DialogTitle>Modifier l&apos;article</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4 px-6 py-4">
//           <div className="space-y-2">
//             <Label htmlFor="title">Titre *</Label>
//             <input
//               id="title"
//               name="title"
//               type="text"
//               value={formData.title}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded ${
//                 errors.title ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {errors.title && (
//               <p className="text-red-500 text-sm">{errors.title}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="content">Contenu *</Label>
//             <textarea
//               id="content"
//               name="content"
//               value={formData.content}
//               onChange={handleChange}
//               rows={8}
//               className={`w-full p-2 border rounded ${
//                 errors.content ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {errors.content && (
//               <p className="text-red-500 text-sm">{errors.content}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="featuredImage">Image mise en avant</Label>
//             <input
//               id="featuredImage"
//               name="featuredImage"
//               type="text"
//               value={formData.featuredImage}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="categoryId">Catégorie *</Label>
//             <select
//               id="categoryId"
//               name="categoryId"
//               value={formData.categoryId}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded ${
//                 errors.categoryId ? "border-red-500" : "border-gray-300"
//               }`}
//             >
//               <option value="" disabled>
//                 Sélectionnez une catégorie
//               </option>
//               {categories.map((category) => (
//                 <option key={category.id} value={category.id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//             {errors.categoryId && (
//               <p className="text-red-500 text-sm">{errors.categoryId}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label>Tags</Label>
//             <div className="flex flex-wrap gap-2">
//               {tags.map((tag) => (
//                 <div key={tag.id} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id={`tag-${tag.id}`}
//                     checked={formData.tagIds.includes(tag.id)}
//                     onChange={() => handleTagChange(tag.id)}
//                     className="mr-2"
//                   />
//                   <Label htmlFor={`tag-${tag.id}`}>#{tag.name}</Label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center space-x-2">
//             <input
//               id="published"
//               name="published"
//               type="checkbox"
//               checked={formData.published}
//               onChange={handleChange}
//               className="h-4 w-4"
//             />
//             <Label htmlFor="published">Publier l&apos;article</Label>
//           </div>
//         </div>
//         <div className="border-t px-6 py-4 flex justify-end gap-2">
//           <DialogClose asChild>
//             <Button variant="outline">Annuler</Button>
//           </DialogClose>
//           <Button onClick={handleSubmit} disabled={isPending}>
//             {isPending ? "Enregistrement..." : "Enregistrer"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
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
import { PencilLineIcon } from "lucide-react";
import { useUpdatePostMutation } from "@/hooks/use-posts";
import { Post } from "@/types/posts";

interface UpdatePostProps {
  post: Post;
  categories: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string }>;
}

type PostFormData = {
  title: string;
  content: string;
  featuredImage?: File | null;
  categoryId: string;
  tagIds: string[];
};

export default function UpdatePost({
  post,
  categories,
  tags,
}: UpdatePostProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const { mutateAsync: updatePostMutation, isPending } =
    useUpdatePostMutation();
  const [formData, setFormData] = useState<PostFormData>({
    title: post.title,
    content: post.content,
    featuredImage: null,
    categoryId: post.category.id,
    tagIds: post.tags?.map((tag) => tag.id) || [],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PostFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PostFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.content.trim()) newErrors.content = "Le contenu est requis";
    if (!formData.categoryId) newErrors.categoryId = "La catégorie est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const form = new FormData();
    form.append("title", formData.title);
    form.append("content", formData.content);
    form.append("categoryId", formData.categoryId);
    formData.tagIds.forEach((tagId) => form.append("tagIds[]", tagId));
    if (formData.featuredImage instanceof File) {
      form.append("featuredImage", formData.featuredImage);
    }

    try {
      await updatePostMutation({
        id: post.id,
        form
      });
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      featuredImage: file,
    }));
  };

  const handleTagChange = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PencilLineIcon className="mr-2 h-4 w-4" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Modifier l&apos;article</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 px-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              className={`w-full p-2 border rounded ${
                errors.content ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Image mise en avant</Label>
            <input
              id="featuredImage"
              name="featuredImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Catégorie *</Label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.categoryId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" disabled>
                Sélectionnez une catégorie
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm">{errors.categoryId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={formData.tagIds.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                    className="mr-2"
                  />
                  <Label htmlFor={`tag-${tag.id}`}>#{tag.name}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
