export interface DashboardStats {
  totalCanteenStudents: number;
  totalRevenue: number;
  revenueGrowthRate: number;
  newCanteenStudentsThisMonth: number;
  growthRate: number;
  expiredAbonnements: number;
  mealsThisMonth: number;
  abonnementRate: number;
  mealsGraphData: { date: string; total: number }[];
}
