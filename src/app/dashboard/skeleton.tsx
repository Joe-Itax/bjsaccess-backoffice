import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex h-screen w-full fixed overflow-hidden">
      {/* Spinner Centré */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>

      {/* Sidebar */}
      <div className="hidden sm:flex flex-col w-20 border-r p-4 space-y-8 bg-background">
        {/* Logo */}
        <Skeleton className="h-10 w-10 rounded-md mx-auto" />

        {/* Navigation icons */}
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-full mx-auto" />
          ))}
        </div>

        {/* Avatar */}
        <div className="mt-auto">
          <Skeleton className="h-10 w-10 rounded-full mx-auto" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-hidden">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>

        {/* Chart + Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Skeleton className="h-8 w-40 rounded-md" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        {/* Table */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full rounded-sm" />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
