"use client";

import { useId } from "react";
import {
  // CheckIcon,
  // EditIcon,
  ImagePlusIcon,
  // XIcon,
  // MapPinIcon,
  MailIcon,
  PhoneIcon,
  CakeIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { useAuthUserQuery } from "@/hooks/use-auth-user";

const initialAvatarImage = [
  {
    name: "avatar.jpg",
    size: 1528737,
    type: "image/jpeg",
    url: "/avatar.jpg",
    id: "avatar-123456789",
  },
];

export default function EditStudent() {
  const id = useId();
  const { data: user } = useAuthUserQuery();
  const maxLength = 180;
  const { value, characterCount, handleChange } = useCharacterLimit({
    maxLength,
    initialValue: "Administrateur de la plateforme Cantine Connect",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full rounded-sm p-0 text-sm outline-hidden select-none"
        >
          <span className="block">Edit</span>
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Modifier le profil</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[80vh]">
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-start gap-4">
              <AvatarSection />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={"outline"} className="px-2 py-0.5">
                    <ShieldCheckIcon className="size-4 text-primary mr-1" />
                    Admin
                  </Badge>
                </div>
              </div>
            </div>

            <form className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-name`}>
                    <span className="flex items-center gap-2">
                      <span>Nom complet</span>
                    </span>
                  </Label>
                  <Input
                    id={`${id}-name`}
                    defaultValue={user?.name}
                    placeholder="Nom complet"
                    type="text"
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor={`${id}-last-name`}>Nom</Label>
                  <Input
                    id={`${id}-last-name`}
                    defaultValue="Khaleira"
                    type="text"
                  />
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor={`${id}-email`}>
                    <span className="flex items-center gap-2">
                      <MailIcon size={16} />
                      <span>Email</span>
                    </span>
                  </Label>
                  <Input
                    id={`${id}-email`}
                    defaultValue={user?.email}
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-phone`}>
                    <span className="flex items-center gap-2">
                      <PhoneIcon size={16} />
                      <span>Téléphone</span>
                    </span>
                  </Label>
                  <Input
                    id={`${id}-phone`}
                    defaultValue="(+243) 97 78 73 421"
                    type="tel"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-dob`}>
                    <span className="flex items-center gap-2">
                      <CakeIcon size={16} />
                      <span>Date de naissance</span>
                    </span>
                  </Label>
                  <Input
                    id={`${id}-dob`}
                    defaultValue="12-10-1990"
                    type="date"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-role`}>Rôle</Label>
                  <Input
                    id={`${id}-role`}
                    defaultValue="Admin"
                    type="text"
                    disabled
                  />
                </div>
              </div>

              <div className="pt-2">
                <Label htmlFor={`${id}-bio`}>Biographie</Label>
                <Textarea
                  id={`${id}-bio`}
                  defaultValue={value}
                  onChange={handleChange}
                  maxLength={maxLength}
                  className="min-h-[100px]"
                  disabled
                />
                <p className="text-muted-foreground text-xs text-right mt-1">
                  {maxLength - characterCount} caractères restants
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Enregistrer</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AvatarSection() {
  const [{ files }, { openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
    initialFiles: initialAvatarImage,
  });

  const { data: user } = useAuthUserQuery();
  const avatarFallback = user?.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  const currentImage = files[0]?.preview || null;

  return (
    <div className="relative">
      <div className="relative size-20 rounded-full border-2 border-white shadow-md overflow-hidden">
        {/* {currentImage ? (
          <Image
            src={currentImage}
            alt="Photo de profil"
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-muted h-full w-full flex items-center justify-center">
            <span className="text-lg font-medium">NK</span>
          </div>
        )} */}
        <Avatar className="size-full rounded-full">
          <AvatarImage
            className="object-cover"
            src={user?.avatarUrl || currentImage || "/placeholder-avatar.png"}
            alt={user?.name}
          />
          <AvatarFallback className="rounded-full text-xl">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </div>
      <button
        type="button"
        className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 text-white shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
        onClick={openFileDialog}
      >
        <ImagePlusIcon size={16} />
      </button>
      <input {...getInputProps()} className="sr-only" />
    </div>
  );
}
