// export interface Post {
// id: string;
// title: string;
// slug: string;
// content: string;
// published: boolean;
// featuredImage: string | null;
// authorId: string;
// categoryId: string;
// createdAt: string;
// updatedAt: string;
// }

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string | null;
  createdAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
    profileImage?: string | null;
  };
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}
