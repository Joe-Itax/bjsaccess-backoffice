export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  newPostsThisMonth: number;
  totalComments: number;
  approvedComments: number;
  pendingComments: number;
  newCommentsThisMonth: number;
  totalCategories: number;
  totalTags: number;
  postsGrowthRate: number;
  approvalRate: number;
  charts: { date: string; posts: number; comments: number }[];
}
