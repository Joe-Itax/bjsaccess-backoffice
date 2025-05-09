import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LoadingDataTable() {
  return (
    <div className="space-y-4">
      {/* Squelette pour les filtres */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-3">
          <Skeleton className="h-9 w-60" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Squelette pour le tableau */}
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 9 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 9 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Squelette pour la pagination */}
      <div className="flex flex-col gap-4 items-stretch @sm:flex-row @sm:items-center @sm:justify-between">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-64" />
      </div>
    </div>
  );
}
