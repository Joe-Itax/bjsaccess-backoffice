export interface Post {
id: string;
title: string;
slug: string;
content: string;
published: boolean;
featuredImage: string | null;
authorId: string;
categoryId: string;
createdAt: string;
updatedAt: string;
}
