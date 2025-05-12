"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProfile from "./edit-profile";
import { Separator } from "@/components/ui/separator";
import { useAuthUserQuery } from "@/hooks/use-auth-user";

export default function ProfilePage() {
  const { data: user } = useAuthUserQuery();

  if (!user) {
    return <div>Chargement du profil...</div>;
  }

  const avatarFallback = user.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <div className="w-full mx-auto p-6 space-y-8">
      {/* Header Profile */}
      <div className="flex justify-center items-center gap-2">
        <h1 className="w-48 font-bold text-xl">Mon compte</h1>
        <div className="w-full h-0.5 bg-gray-200 rounded-4xl"></div>
        {/* <Separator /> */}
      </div>
      <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-6">
        <Avatar className="h-20 w-20 rounded-full">
          <AvatarImage
            src={user.profileImage || "/placeholder-avatar.png"}
            alt={user.name}
          />
          <AvatarFallback className="rounded-full text-xl">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold text-primary">{user.name}</h2>
          <p className="text-muted-foreground capitalize">{user.role}</p>
        </div>
      </div>

      {/* Informations de base */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Informations du compte</h3>
          <EditProfile />
        </div>

        {/* <div className="w-full h-1 bg-gray-200 rounded-4xl"></div> */}
        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <InfoItem label="Nom complet" value={user.name} />
          <InfoItem label="Adresse email" value={user.email} />
          <InfoItem label="Rôle" value={user.role} />
          <InfoItem
            label="Date de création"
            value={formatDate(user.createdAt)}
          />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
