"use client";

import { useParams, useRouter } from "next/navigation";
import { useUserQuery } from "@/hooks/use-users";
import { useCanteenStudentsByParentQuery } from "@/hooks/use-students";
import Link from "next/link";
import { CanteenStudent } from "@/types/student";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleAlertIcon, MoveLeftIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetailsPage() {
  const { userId } = useParams();
  const router = useRouter();
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useUserQuery(userId as string);

  const isParent = user?.role === "parent";

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !user)
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

  return (
    <section className="p-6 max-w-4xl mx-auto space-y-6">
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
          <Badge variant={user.role === "parent" ? "default" : "secondary"}>
            {user.role}
          </Badge>
        </div>
      </div>

      {/* Affichage spécifique pour les parents */}
      {isParent && (
        <div className="bg-muted/20 rounded-lg p-4">
          <GetCanteenStudentsLinkedToAParent userId={`${userId}`} />
        </div>
      )}
    </section>
  );
}

function GetCanteenStudentsLinkedToAParent({ userId }: { userId: string }) {
  const { data: linkedStudents, isLoading } =
    useCanteenStudentsByParentQuery(userId);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-6 w-32 rounded-md mb-2" />
        <Skeleton className="h-4 w-full rounded-md" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Élèves liés</h3>
      {linkedStudents && linkedStudents.length > 0 ? (
        <ul className="list-disc pl-6 space-y-1">
          {linkedStudents.map((student: CanteenStudent) => (
            <div key={student.id}>
              <li>
                <Link
                  href={`/dashboard/students/${student.id}`}
                  className="border-b border-blue-600"
                >
                  {student.enrolledStudent.name}
                </Link>{" "}
              </li>
              <span className="text-muted-foreground">
                ({student.enrolledStudent.matricule} -{" "}
                {student.enrolledStudent.class})
              </span>
            </div>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">Aucun élève lié à ce parent.</p>
      )}
    </div>
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
