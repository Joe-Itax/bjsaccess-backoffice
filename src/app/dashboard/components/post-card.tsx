"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/posts";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckCircleIcon, CircleOffIcon, MoveRight, UserIcon } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const [hoverBox, setHoverBox] = useState(false);

  const handleHover = () => {
    setHoverBox(!hoverBox);
  };

  return (
    <div
      className="max-w-md size-full rounded shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 relative"
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
    >
      <div className="absolute top-8 left-0 z-20">
        <span className="inline-block bg-primary px-3.5 py-2.5 text-sm font-semibold text-white">
          {post.category.name}
        </span>
      </div>

      <div className="h-72 overflow-hidden">
        {post.featuredImage && (
          <Image
            src={post.featuredImage}
            alt={post.title}
            className={`w-full h-full object-cover mb-4 ${
              hoverBox ? "transform scale-110" : ""
            } transition-all duration-300`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            width={800}
            height={400}
          />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <UserIcon className="text-blue-500 mr-1" size={20} />{" "}
          <span>{post.author.name}</span>
          <span className="mx-2">•</span>
          <CalendarIcon className="text-blue-500 mr-1" size={20} />
          <span>{formatDate(post.createdAt)}</span>
          <span className="mx-2">•</span>
          {post.published ? (
            <CheckCircleIcon className="text-blue-500 mr-1" size={20} />
          ) : (
            <CircleOffIcon className="text-red-500 mr-1" size={20} />
          )}
          <span>Publié</span>
        </div>

        <h3 className="text-xl font-bold mb-2 text-gray-800 truncate">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-block bg-blue-100 rounded-full px-3 py-1 text-xs font-semibold text-blue-800"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

<Link href={`/dashboard/posts/${post.id}`}>
        <Button
          variant="link"
          className="inline-flex items-center justify-center text-blue-500 hover:text-blue-700 font-medium uppercase"
        >
          Lire plus
          <MoveRight className={`${hoverBox ? "animate-bounce" : ""}`} />
        </Button>
        </Link>
      </div>
    </div>
  );
}
