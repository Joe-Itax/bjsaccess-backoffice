/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  EllipsisIcon,
  FilterIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "use-debounce";
import { useSearchUsersMutation } from "@/hooks/use-users";

import AddStudentToCanteen from "../students/add-student";
import {
  useCanteenStudentsQuery,
  useRemoveCanteenStudentMutation,
  useSearchCanteenStudentsMutation,
} from "@/hooks/use-students";
import ErrorThenRefresh from "./error";
import LoadingDataTable from "./loading";
import { useRouter } from "next/navigation";

import type { CanteenStudent } from "@/types/student";

const columns: ColumnDef<CanteenStudent>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.enrolledStudent.name,
    id: "name",
    header: "Nom",
    cell: ({ row }) => (
      <div className={`font-medium ${!row.original.isActive && "bg-red-400"}`}>
        {row.original.enrolledStudent.name}
      </div>
    ),
    size: 150,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.parent.user.email,
    id: "email",
    header: "Email Parent",
    cell: ({ row }) => <div>{row.original.parent.user.email}</div>,
    size: 150,
  },
  {
    accessorFn: (row) => row.enrolledStudent.class,
    id: "class",
    header: "Classe",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">
        {row.original.enrolledStudent.class}
      </div>
    ),
    size: 300,
  },
  {
    accessorFn: (row) =>
      row.enrolledStudent.gender === "M" ? "Masculin" : "Féminin",
    id: "gender",
    header: "Genre",
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string;
      return (filterValue as string[]).includes(value);
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.enrolledStudent.gender === "M" ? "Masculin" : "Féminin"}
      </Badge>
    ),
    size: 80,
  },
  {
    accessorFn: (row) => row.enrolledStudent.matricule,
    id: "matricule",
    header: "Matricule",
    cell: ({ row }) => <div>{row.original.enrolledStudent.matricule}</div>,
    size: 80,
  },
  {
    accessorFn: (row) => {
      const hasActiveAbonnement = row.abonnements?.some(
        (abonnement) => abonnement.status === "actif"
      );
      return hasActiveAbonnement ? "Actif" : "Inactif";
    },
    id: "status",
    header: "Abonnement",
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string;
      return (filterValue as string[]).includes(value);
    },
    cell: ({ row }) => {
      const hasActiveAbonnement = row.original.abonnements?.some(
        (abonnement) => abonnement.status === "actif"
      );

      return (
        <Badge
          variant={hasActiveAbonnement ? "default" : "secondary"}
          className={cn(
            !hasActiveAbonnement &&
              "bg-muted-foreground/60 text-primary-foreground"
          )}
        >
          {hasActiveAbonnement ? "Actif" : "Inactif"}
        </Badge>
      );
    },
    size: 120,
  },
  {
    accessorFn: (row) => {
      const activeAbonnement = row.abonnements?.find(
        (abonnement) => abonnement.status === "actif"
      );
      return activeAbonnement
        ? new Date(activeAbonnement.startDate).toLocaleDateString()
        : null;
    },
    id: "endDate",
    header: "Date d'expiration",
    cell: ({ row }) => {
      const activeAbonnement = row.original.abonnements?.find(
        (abonnement) => abonnement.status === "actif"
      );

      return activeAbonnement ? (
        <div>{new Date(activeAbonnement.endDate).toLocaleDateString()}</div>
      ) : (
        <div className="text-muted-foreground">-</div>
      );
    },
    size: 100,
  },
  {
    id: "actions",
    meta: { isDisplayColumn: true },
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 50,
    enableHiding: false,
  },
];

export default function StudentsDataTable() {
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 1000);
  const searchCanteenStudentsMutation = useSearchCanteenStudentsMutation();

  useEffect(() => {
    if (debouncedQuery) {
      searchCanteenStudentsMutation.mutate(debouncedQuery);
    } else {
      searchCanteenStudentsMutation.reset();
    }
  }, [debouncedQuery]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const {
    data: dataUseCanteenStudentsQuery,
    isLoading,
    isError,
    pagination,
    setPage,
    setPageSize,
  } = useCanteenStudentsQuery();

  const totalItems =
    (searchCanteenStudentsMutation.data?.totalItems ??
      dataUseCanteenStudentsQuery?.totalItems) ||
    0;
  const totalPages =
    (searchCanteenStudentsMutation.data?.totalPages ??
      dataUseCanteenStudentsQuery?.totalPages) ||
    1;

  const canteenStudents = dataUseCanteenStudentsQuery?.data || [];
  const students = searchCanteenStudentsMutation?.data?.data ?? canteenStudents;

  const removeCanteenStudentMutation = useRemoveCanteenStudentMutation();

  const handleDeleteRows = async () => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);
    if (selectedIds.length === 0) return;

    try {
      await removeCanteenStudentMutation.mutateAsync(selectedIds);
      table.resetRowSelection(); // Désélectionner les lignes après suppression
    } catch (error) {
      console.error("Erreur lors de la désinscription multiple", error);
    }
  };

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;
      setPage(next.pageIndex);
      setPageSize(next.pageSize);
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  // Filtres pour le statut d'abonnement
  const subscriptionStatusOptions = useMemo(() => ["Actif", "Inactif"], []);

  // Filtres pour le genre
  const genderOptions = useMemo(() => ["Masculin", "Féminin"], []);

  const selectedSubscriptionStatuses = useMemo(() => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("status")?.getFilterValue()]);

  const selectedGenders = useMemo(() => {
    const filterValue = table.getColumn("gender")?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("gender")?.getFilterValue()]);

  const handleFilterChange = (
    columnId: string,
    checked: boolean,
    value: string
  ) => {
    const filterValue = table.getColumn(columnId)?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn(columnId)
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  if (isLoading && canteenStudents.length === 0) {
    return <LoadingDataTable />;
  }

  if (isError) {
    return <ErrorThenRefresh />;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-3">
          {/* Filter by name, class or matricule */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-60 ps-9",
                Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer par nom, classe ou matricule..."
              type="text"
              aria-label="Filtrer par nom"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
              {searchCanteenStudentsMutation.isPending && (
                <div
                  className="absolute inset-y-0 start-2 top-1/2
              -translate-y-1/2 focus:z-10 pointer-events-none size-6 animate-spin rounded-full border-3 border-primary border-t-transparent"
                ></div>
              )}
            </div>

            {searchQuery && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  setSearchQuery("");
                  if (inputRef.current) inputRef.current.focus();
                }}
                aria-label="Effacer la recherche"
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Filter by subscription status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Statut
                {selectedSubscriptionStatuses.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {selectedSubscriptionStatuses.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Statut d&apos;abonnement
                </div>
                <div className="space-y-3">
                  {subscriptionStatusOptions.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-status-${i}`}
                        checked={selectedSubscriptionStatuses.includes(value)}
                        onCheckedChange={(checked: boolean) =>
                          handleFilterChange("status", checked, value)
                        }
                      />
                      <Label
                        htmlFor={`${id}-status-${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Filter by gender */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Genre
                {selectedGenders.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {selectedGenders.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Genre
                </div>
                <div className="space-y-3">
                  {genderOptions.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-gender-${i}`}
                        checked={selectedGenders.includes(value)}
                        onCheckedChange={(checked: boolean) =>
                          handleFilterChange("gender", checked, value)
                        }
                      />
                      <Label
                        htmlFor={`${id}-gender-${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Toggle columns visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Colonnes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Colonnes visibles</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event) => event.preventDefault()}
                    >
                      {column.id === "name" && "Nom"}
                      {column.id === "email" && "Email Parent"}
                      {column.id === "class" && "Classe"}
                      {column.id === "gender" && "Genre"}
                      {column.id === "matricule" && "Matricule"}
                      {column.id === "status" && "Statut"}
                      {column.id === "endDate" && "Expiration"}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <TrashIcon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Supprimer
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Etes-vous sûr de vouloir supprimer?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée. Cela supprimera
                      définitivement {table.getSelectedRowModel().rows.length}{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "élève"
                        : "élèves"}{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "sélectionné"
                        : "sélectionnés"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* Add student button */}
          <AddStudentToCanteen />
        </div>
      </div>

      {/* Table */}
      <div className="bg-background overflow-hidden rounded-md border [&>div]:max-h-96">
        <Table className="table-fixed [&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
          <TableHeader className=" bg-background/90 sticky top-0 z-10 backdrop-blur-xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-0">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className={`h-24 text-center `}
                >
                  Aucun élève trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 items-stretch @sm:flex-row @sm:items-center @sm:justify-between">
        {/* Results per page */}
        <div className="flex items-center justify-between gap-3 w-full">
          <Label htmlFor={id} className="max-sm:sr-only">
            Lignes par page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger
              id={id}
              className="w-fit whitespace-nowrap  cursor-pointer"
            >
              <SelectValue placeholder="Sélectionner le nombre de résultats" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {[10].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={pageSize.toString()}
                  className="cursor-pointer"
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Page number information */}
          <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
            <p
              className="text-muted-foreground text-sm whitespace-nowrap"
              aria-live="polite"
            >
              <span className="text-foreground">
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
                -
                {Math.min(
                  Math.max(
                    table.getState().pagination.pageIndex *
                      table.getState().pagination.pageSize +
                      table.getState().pagination.pageSize,
                    0
                  ),
                  totalItems
                )}
              </span>{" "}
              sur <span className="text-foreground">{totalItems}</span>
            </p>
          </div>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Aller à la première page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Page précédente"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Page suivante"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  aria-label="Aller à la dernière page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

function RowActions({ row }: { row: Row<CanteenStudent> }) {
  const removeCanteenStudentMutation = useRemoveCanteenStudentMutation();

  const router = useRouter();

  const handleRemove = async () => {
    try {
      await removeCanteenStudentMutation.mutateAsync([row.original.id]);
    } catch (error) {
      console.error("Erreur lors de la désinscription", error);
    }
  };

  const openCanteenStudentDetails = () => {
    router.push(`/dashboard/students/${row.original.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Actions"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={openCanteenStudentDetails}>
            <span>Voir les détails</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {row.original.isActive && (
          <>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <span>Désinscrire de la cantine</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Confirmer la désinscription
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir désinscrire{" "}
                    {row.original.enrolledStudent.name} de la cantine ?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRemove}
                    disabled={removeCanteenStudentMutation.isPending}
                  >
                    {removeCanteenStudentMutation.isPending
                      ? "En cours..."
                      : "Confirmer"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
