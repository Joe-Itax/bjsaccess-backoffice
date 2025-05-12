import { DashboardStats } from "@/types/dashboard-stat";
import { useQuery } from "@tanstack/react-query";
import { getAccessToken } from "./use-auth-user";

const token = getAccessToken();

export function useDashboardStatsQuery() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/admin/dashboard/stats`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        if (!res.ok) {
          console.error("Erreur lors du fetch des stats: ", data.message);
          throw new Error("Erreur lors du fetch des stats");
        }

        return data;
      } catch (error) {
        console.error(`Erreur lors du fetch des stats. Erreur: ${error}`);
      }
    },
    staleTime: 5 * 60 * 1000,
    // refetchOnWindowFocus: false,
  });
}
