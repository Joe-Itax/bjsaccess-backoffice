"use client";

import { useParams, useRouter } from "next/navigation";
import {  useUserQuery } from "@/hooks/use-users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleAlertIcon, MoveLeftIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteUser from "../../components/delete-user";
import UpdateUser from "../../components/update-user";

export default function UserDetailsPage() {
  const { userId } = useParams();
  const router = useRouter();
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useUserQuery(userId as string);
  

  if (isLoading) return <LoadingSkeleton />;

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
        <CircleAlertIcon className="text-destructive" size={48} />
        <h3 className="text-xl font-semibold">Erreur de chargement</h3>
        <p className="text-muted-foreground">{isError}</p>
        <Button
          onClick={async () => {
            await refetch();
          }}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <section className="p-6 size-full max-w-[55rem] mx-auto flex flex-col gap-8">
      <div className="w-full space-y-6">
        <div className="flex items-start gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <MoveLeftIcon />
          </Button>
          <h2 className="text-2xl font-bold">Profil de {user.name}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/20 rounded-lg p-4">
            <h3 className="font-semibold">Nom complet</h3>
            <p className="text-muted-foreground">{user.name}</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-4">
            <h3 className="font-semibold">Adresse email</h3>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-4">
            <h3 className="font-semibold">Rôle</h3>
            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
              {user.role}
            </Badge>
          </div>
          <div className="bg-muted/20 rounded-lg p-4">
            <h3 className="font-semibold">Actions</h3>
            {/* <p className="text-muted-foreground">{user.postsCount}</p> */}
            <div className="flex flex-wrap gap-2">
              {/* <Button variant={"outline"}>
                Edit <EditIcon color="blue" />
              </Button> */}
              <UpdateUser user={user} />
              <DeleteUser
                user={user}
                // deleteUserMutation={deleteUserMutation}
                // handleDeleteUser={handleDeleteUser}
                // openDialog={openDialog}
                // setOpenDialog={setOpenDialog}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-blue-400 size-full">
        <h3 className="text-xl font-semibold">
          {user.postsCount} Post{user.postsCount > 1 && "s"} publié
          {user.postsCount > 1 && "s"}:
        </h3>
        {user.postsCount > 0 ? (
          <ul className="">
            {user.posts.map((post) => (
              <li key={post.id} className="flex gap-2">
                <div className="h-8 w-8 rounded-md bg-muted/20">
                  {post.title}
                </div>
                <div className="flex flex-col gap-1"></div>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <p>Aucun Post disponible</p>
          </div>
        )}
      </div>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <section className="p-6 sm:min-w-xs max-w-full mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-8 w-64 rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center space-y-2">
        <Skeleton className="h-16 w-32 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
      </div>
    </section>
  );
}
