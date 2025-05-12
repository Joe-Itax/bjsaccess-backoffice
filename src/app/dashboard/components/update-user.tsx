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

import { useUpdateUserMutation } from "@/hooks/use-users";
import { User } from "@/types/user";

type UserFormData = {
  name: string;
  email: string;
  role: "ADMIN" | "AUTHOR";
  password: string;
  confirmPassword: string;
};

interface UpdateUserProps {
  user: User;
}

export default function UpdateUser({ user }: UpdateUserProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const { mutateAsync: updateUserMutation, isPending } =
    useUpdateUserMutation();
  const [formData, setFormData] = useState<UserFormData>({
    name: user.name || "",
    email: user.email || "",
    role: (user.role as "ADMIN" | "AUTHOR") || "AUTHOR",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  //   const { mutateAsync: createUser, isPending } = useAddUserMutation();

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailValid.test(formData.email)) {
      console.log("email invalideelse if");
      newErrors.email = "Email invalide";
    }
    if (formData.password && !passwordValid.test(formData.password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const updateUser = {
      name: formData.name,
      email: formData.email,
      //   role: formData.role,
    };

    if (formData.role !== user.role) {
      Object.assign(updateUser, { role: formData.role });
    }

    if (formData.password) {
      Object.assign(updateUser, { password: formData.password });
    }

    try {
      const userUpdated = await updateUserMutation({
        id: user.id,
        ...updateUser,
      });

      setFormData({
        name: userUpdated.user.name || "",
        email: userUpdated.user.email || "",
        role: (userUpdated.user.role as "ADMIN" | "AUTHOR") || "AUTHOR",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof UserFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="" variant="outline">
          <PencilLineIcon
            className="-ms-1 opacity-60"
            size={16}
            aria-hidden="true"
          />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Mettre à jour l&apos;utilisateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 px-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle *</Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="AUTHOR">Auteur</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
