"use client";

import {
  useCategoriesQuery,
  usePostsQuery,
  useTagsQuery,
} from "@/hooks/use-posts";
import PostCard from "../components/post-card";
import { Post } from "@/types/posts";
import CreatePost from "../components/create-post";

export default function PostsPage() {
  const { data: posts, isPending } = usePostsQuery();
  const { data: dataCategories = [] } = useCategoriesQuery();
  const categories = dataCategories?.data;
  const { data: datatags = [] } = useTagsQuery();
  const tags = datatags?.data;

  if (isPending) {
    return <div>Chargement</div>;
  }
  return (
    <section className="container size-full mx-auto flex justify-center">
      <div className=" px-2 md:p-8 sm:px-4">
        <div>
          <CreatePost categories={categories} tags={tags} />
        </div>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-4 py-4">
            {posts.map((post: Post) => (
              <div key={post.id} className="size-full flex justify-center">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>Aucun Post disponible</p>
          </div>
        )}
      </div>
    </section>
  );
}
