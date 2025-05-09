import { Button } from "@/components/ui/button";
import { useCanteenStudentsQuery } from "@/hooks/use-students";
import { CircleAlertIcon } from "lucide-react";

export default function ErrorThenRefresh() {
  const { isError, refetch } = useCanteenStudentsQuery();
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

// ça n'a pas résolu le problème, et d'ailleurs le composant de base fonctionnait très bien sans les trucs que tu viens de rajouter... Bon, le mieux serait de checker l'ensemble du fichier, trouver d'abord l'erreur, et améliorer ou corriger les éventuels erreurs:
// src\app\dashboard\components\students-data-table.tsx (PS: j'ai retiré les importations ainsi que quelques lignes de code pas importants pour alléger la requete, sinon t'es entrain de raler et de plurer que ohhh y'a trop de textes):

// interface CanteenStudent {
//   id: string;
//   enrolledStudent: {
//     id: string;
//     name: string;
//     class: string;
//     gender: string;
//     matricule: string;
//   };
//   parent: {
//     user: {
//       email: string;
//     };
//   };
//   abonnements?: {
//     status: string;
//     startDate: string;
//     endDate: string;
//   }[];
// }

// const columns: ColumnDef<CanteenStudent, unknown>[] = [
//   {
//     id: "select",
//     meta: { isDisplayColumn: true },
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     size: 28,
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorFn: (row) => row.enrolledStudent.name,
//     id: "name",
//     header: "Nom",
//     cell: ({ row }) => (
//       <div className="font-medium">{row.original.enrolledStudent.name}</div>
//     ),
//     size: 150,
//     enableHiding: false,
//   },
//   {
//     accessorFn: (row) => row.parent.user.email,
//     id: "email",
//     header: "Email Parent",
//     cell: ({ row }) => <div>{row.original.parent.user.email}</div>,
//     size: 150,
//   },
//   {
//     accessorFn: (row) => row.enrolledStudent.class,
//     id: "class",
//     header: "Classe",
//     cell: ({ row }) => (
//       <div className="max-w-[300px] truncate">
//         {row.original.enrolledStudent.class}
//       </div>
//     ),
//     size: 300,
//   },
//   {
//     accessorFn: (row) =>
//       row.enrolledStudent.gender === "M" ? "Masculin" : "Féminin",
//     id: "gender",
//     header: "Genre",
//     filterFn: (row, columnId, filterValue) => {
//       const value = row.getValue(columnId) as string;
//       return (filterValue as string[]).includes(value);
//     },
//     cell: ({ row }) => (
//       <Badge variant="outline" className="capitalize">
//         {row.original.enrolledStudent.gender === "M" ? "Masculin" : "Féminin"}
//       </Badge>
//     ),
//     size: 80,
//   },
//   {
//     accessorFn: (row) => row.enrolledStudent.matricule,
//     id: "matricule",
//     header: "Matricule",
//     cell: ({ row }) => <div>{row.original.enrolledStudent.matricule}</div>,
//     size: 80,
//   },
//   {
//     accessorFn: (row) => {
//       const hasActiveAbonnement = row.abonnements?.some(
//         (abonnement) => abonnement.status === "actif"
//       );
//       return hasActiveAbonnement ? "Actif" : "Inactif";
//     },
//     id: "status",
//     header: "Statut Abonnement",
//     filterFn: (row, columnId, filterValue) => {
//       const value = row.getValue(columnId) as string;
//       return (filterValue as string[]).includes(value);
//     },
//     cell: ({ row }) => {
//       const hasActiveAbonnement = row.original.abonnements?.some(
//         (abonnement) => abonnement.status === "actif"
//       );

//       return (
//         <Badge
//           variant={hasActiveAbonnement ? "default" : "secondary"}
//           className={cn(
//             !hasActiveAbonnement &&
//               "bg-muted-foreground/60 text-primary-foreground"
//           )}
//         >
//           {hasActiveAbonnement ? "Actif" : "Inactif"}
//         </Badge>
//       );
//     },
//     size: 120,
//   },
//   {
//     accessorFn: (row) => {
//       const activeAbonnement = row.abonnements?.find(
//         (abonnement) => abonnement.status === "actif"
//       );
//       return activeAbonnement
//         ? new Date(activeAbonnement.startDate).toLocaleDateString()
//         : null;
//     },
//     id: "endDate",
//     header: "Date d'expiration",
//     cell: ({ row }) => {
//       const activeAbonnement = row.original.abonnements?.find(
//         (abonnement) => abonnement.status === "actif"
//       );

//       return activeAbonnement ? (
//         <div>{new Date(activeAbonnement.endDate).toLocaleDateString()}</div>
//       ) : (
//         <div className="text-muted-foreground">-</div>
//       );
//     },
//     size: 100,
//   },
//   {
//     id: "actions",
//     header: () => <span className="sr-only">Actions</span>,
//     cell: ({ row }) => <RowActions row={row} />,
//     size: 50,
//     enableHiding: false,
//   },
// ];

// export default function StudentsDataTable() {
//   const id = useId();
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

//   const inputRef = useRef<HTMLInputElement>(null);
//   const [sorting, setSorting] = useState<SortingState>([
//     { id: "name", desc: false },
//   ]);

//   const {
//     data,
//     isLoading,
//     isError,
//     pagination,
//     setPage,
//     setPageSize,
//   } = useCanteenStudentsQuery();

//   const totalItems = data?.totalItems || 0;
//   const canteenStudents = data?.data || [];

//   const handleDeleteRows = () => {
//     // Implémentez la logique de suppression ici
//   };

//   const table = useReactTable({
//     data: canteenStudents,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     onSortingChange: setSorting,
//     enableSortingRemoval: false,
//     getPaginationRowModel: getPaginationRowModel(),
//     onPaginationChange: (updater) => {
//       const next =
//         typeof updater === "function" ? updater(pagination) : updater;
//       setPage(next.pageIndex + 1);
//       setPageSize(next.pageSize);
//     },
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     getFilteredRowModel: getFilteredRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//     manualPagination: true,
//     pageCount: data?.totalPages,
//     state: {
//       sorting,
//       pagination,
//       columnFilters,
//       columnVisibility,
//     },
//   });

//   // Filtres pour le statut d'abonnement
//   const subscriptionStatusOptions = useMemo(() => ["Actif", "Inactif"], []);


//   return (
//     <div className="space-y-4">
//       {/* Filters */}
      

//       {/* Table */}
//       <div className="bg-background overflow-hidden rounded-md border [&>div]:max-h-96">
//         <Table className="table-fixed [&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
//           <TableHeader className=" bg-background/90 sticky top-0 z-10 backdrop-blur-xs">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id} className="hover:bg-transparent">
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead
//                       key={header.id}
//                       style={{ width: `${header.getSize()}px` }}
//                       className="h-11"
//                     >
//                       {header.isPlaceholder ? null : header.column.getCanSort() ? (
//                         <div
//                           className={cn(
//                             header.column.getCanSort() &&
//                               "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
//                           )}
//                           onClick={header.column.getToggleSortingHandler()}
//                           onKeyDown={(e) => {
//                             if (
//                               header.column.getCanSort() &&
//                               (e.key === "Enter" || e.key === " ")
//                             ) {
//                               e.preventDefault();
//                               header.column.getToggleSortingHandler()?.(e);
//                             }
//                           }}
//                           tabIndex={header.column.getCanSort() ? 0 : undefined}
//                         >
//                           {flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                           {{
//                             asc: (
//                               <ChevronUpIcon
//                                 className="shrink-0 opacity-60"
//                                 size={16}
//                                 aria-hidden="true"
//                               />
//                             ),
//                             desc: (
//                               <ChevronDownIcon
//                                 className="shrink-0 opacity-60"
//                                 size={16}
//                                 aria-hidden="true"
//                               />
//                             ),
//                           }[header.column.getIsSorted() as string] ?? null}
//                         </div>
//                       ) : (
//                         flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )
//                       )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id} className="last:py-0">
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   Aucun élève trouvé.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="flex flex-col gap-4 items-stretch @sm:flex-row @sm:items-center @sm:justify-between">
//         {/* Results per page */}
//         <div className="flex items-center justify-between gap-3 w-full">
//           <Label htmlFor={id} className="max-sm:sr-only">
//             Lignes par page
//           </Label>
//           <Select
//             value={table.getState().pagination.pageSize.toString()}
//             onValueChange={(value) => {
//               table.setPageSize(Number(value));
//             }}
//           >
//             <SelectTrigger
//               id={id}
//               className="w-fit whitespace-nowrap  cursor-pointer"
//             >
//               <SelectValue placeholder="Sélectionner le nombre de résultats" />
//             </SelectTrigger>
//             <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
//               {[10].map((pageSize) => (
//                 <SelectItem
//                   key={pageSize}
//                   value={pageSize.toString()}
//                   className="cursor-pointer"
//                 >
//                   {pageSize}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Page number information */}
//           <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
//             <p
//               className="text-muted-foreground text-sm whitespace-nowrap"
//               aria-live="polite"
//             >
//               <span className="text-foreground">
//                 {table.getState().pagination.pageIndex *
//                   table.getState().pagination.pageSize +
//                   1}
//                 -
//                 {Math.min(
//                   Math.max(
//                     table.getState().pagination.pageIndex *
//                       table.getState().pagination.pageSize +
//                       table.getState().pagination.pageSize,
//                     0
//                   ),
//                   totalItems
//                 )}
//               </span>{" "}
//               sur <span className="text-foreground">{totalItems}</span>
//             </p>
//           </div>
//         </div>

//         {/* Pagination buttons */}
//         <div>
//           <Pagination>
//             <PaginationContent>
//               {/* First page button */}
//               <PaginationItem>
//                 <Button
//                   size="icon"
//                   variant="outline"
//                   className="disabled:pointer-events-none disabled:opacity-50"
//                   onClick={() => table.setPageIndex(0)}
//                   disabled={!table.getCanPreviousPage()}
//                   aria-label="Aller à la première page"
//                 >
//                   <ChevronFirstIcon size={16} aria-hidden="true" />
//                 </Button>
//               </PaginationItem>
//               {/* Previous page button */}
//               <PaginationItem>
//                 <Button
//                   size="icon"
//                   variant="outline"
//                   className="disabled:pointer-events-none disabled:opacity-50"
//                   onClick={() => table.previousPage()}
//                   disabled={!table.getCanPreviousPage()}
//                   aria-label="Page précédente"
//                 >
//                   <ChevronLeftIcon size={16} aria-hidden="true" />
//                 </Button>
//               </PaginationItem>
//               {/* Next page button */}
//               <PaginationItem>
//                 <Button
//                   size="icon"
//                   variant="outline"
//                   className="disabled:pointer-events-none disabled:opacity-50"
//                   onClick={() => table.nextPage()}
//                   disabled={!table.getCanNextPage()}
//                   aria-label="Page suivante"
//                 >
//                   <ChevronRightIcon size={16} aria-hidden="true" />
//                 </Button>
//               </PaginationItem>
//               {/* Last page button */}
//               <PaginationItem>
//                 <Button
//                   size="icon"
//                   variant="outline"
//                   className="disabled:pointer-events-none disabled:opacity-50"
//                   onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//                   disabled={!table.getCanNextPage()}
//                   aria-label="Aller à la dernière page"
//                 >
//                   <ChevronLastIcon size={16} aria-hidden="true" />
//                 </Button>
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>
//       </div>
//     </div>
//   );
// }

// function RowActions({ row }: { row: Row<CanteenStudent> }) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <div className="flex justify-end">
//           <Button
//             size="icon"
//             variant="ghost"
//             className="shadow-none"
//             aria-label="Actions"
//           >
//             <EllipsisIcon size={16} aria-hidden="true" />
//           </Button>
//         </div>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuGroup>
//           <DropdownMenuItem>
//             <span>Modifier</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <span>Voir les détails</span>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>
//           <span>Gérer les abonnements</span>
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem className="text-destructive focus:text-destructive">
//           <span>Désinscrire de la cantine</span>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }


