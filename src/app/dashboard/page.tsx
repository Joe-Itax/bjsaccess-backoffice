"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStatsQuery } from "@/hooks/use-dashboard-overview";
import { DashboardStats } from "@/types/dashboard-stat";

const defaultStats: DashboardStats = {
  totalPosts: 0,
  publishedPosts: 0,
  draftPosts: 0,
  newPostsThisMonth: 0,
  totalComments: 0,
  approvedComments: 0,
  pendingComments: 0,
  newCommentsThisMonth: 0,
  totalCategories: 0,
  totalTags: 0,
  postsGrowthRate: 0,
  approvalRate: 0,
  charts: [],
};

export default function DashboardPage() {
  const { data: stats = defaultStats } = useDashboardStatsQuery();
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {!stats.charts.length ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <SectionCards stats={stats} />

          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={stats.charts} />
          </div>
        </>
      )}

      <div className="px-4 lg:px-6">{/* <StudentsDataTable /> */}</div>
    </div>
  );
}

function Loading() {
  return (
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
    </div>
  );
}
