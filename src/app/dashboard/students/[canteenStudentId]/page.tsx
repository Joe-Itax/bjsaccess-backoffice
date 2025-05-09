"use client";

import { useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toJpeg } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCanteenStudentByIdQuery } from "@/hooks/use-students";
import { QRCodeSVG } from "qrcode.react";
import { MoveLeftIcon, DownloadIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CanteenStudent() {
  const params = useParams<{
    canteenStudentId: string;
  }>();
  const canteenStudentId = params.canteenStudentId;
  const router = useRouter();

  const { data, isLoading } = useCanteenStudentByIdQuery(canteenStudentId);
  const student = data?.data;
  const abonnement = student?.abonnements?.[0];

  const qrRef = useRef<HTMLDivElement>(null);

  const handleExportQrCode = () => {
    if (!qrRef.current || !student) return;

    const fileName = `cantineconnect-${student.enrolledStudent.name.replace(
      /\s+/g,
      "-"
    )}-${student.id}.jpg`;

    // Options pour désactiver le traitement des polices
    const options = {
      quality: 0.95,
      skipFonts: true,
      cacheBust: true,
      style: {
        fontFamily: "Arial, sans-serif",
      },
    };

    toJpeg(qrRef.current, options)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Erreur lors de l'export QR Code :", err);
      });
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!student) {
    return (
      <section className="p-6 max-w-4xl mx-auto">
        <p>{data.message || `Élève non trouvé`}</p>
      </section>
    );
  }

  return (
    <section className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <MoveLeftIcon />
        </Button>

        <h2 className="text-2xl font-bold">
          Détails de l&apos;élève inscrit à la cantine
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted/20 rounded-lg p-4">
          <h3 className="font-semibold">Nom de l&apos;élève</h3>
          <p className="text-muted-foreground">
            {student.enrolledStudent.name}
          </p>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <h3 className="font-semibold">Matricule</h3>
          <p className="text-muted-foreground">
            {student.enrolledStudent.matricule}
          </p>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <h3 className="font-semibold">Classe</h3>
          <p className="text-muted-foreground">
            {student.enrolledStudent.class}
          </p>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <h3 className="font-semibold">Statut de l&apos;abonnement</h3>
          <Badge
            variant={abonnement?.status === "actif" ? "default" : "destructive"}
          >
            {abonnement?.status || "inconnu"}
          </Badge>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <h3 className="font-semibold">Date d&apos;abonnement</h3>
          <p className="text-muted-foreground">
            {abonnement?.startDate
              ? `${new Date(abonnement.startDate).toLocaleDateString()} - ${
                  abonnement?.status === "actif" &&
                  new Date(abonnement.endDate).toLocaleDateString()
                }`
              : "Non disponible"}
          </p>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <h3 className="font-semibold">Parent lié</h3>
          <p className="text-muted-foreground">
            {student.parent?.user?.name} ({student.parent?.user?.email})
          </p>
        </div>
      </div>
      <div className="bg-muted/20 rounded-lg p-4 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div ref={qrRef}>
            <QRCodeSVG value={student.matriculeHashe} size={128} />
          </div>
          <Button variant="outline" onClick={handleExportQrCode}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exporter en JPG
          </Button>
        </div>
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
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center space-y-2">
        <Skeleton className="h-32 w-32 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
      </div>
    </section>
  );
}
