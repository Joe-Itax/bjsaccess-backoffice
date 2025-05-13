export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string | null;
  published: boolean;
  createdAt: string;
  category: Category;
  author: {
    id: string;
    name: string;
    profileImage?: string | null;
  };
  tags?: Tag[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  visitorName: string;
  visitorEmail: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category{
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

