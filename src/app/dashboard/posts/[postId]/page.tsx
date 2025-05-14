"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarIcon,
  CheckCircleIcon,
  CircleAlertIcon,
  CircleOffIcon,
  MoveLeftIcon,
  UserIcon,
} from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";

import {
  useCategoriesQuery,
  useDeleteCommentMutation,
  useModerateCommentMutation,
  usePostByIdQuery,
  usePublishPostMutation,
  useTagsQuery,
} from "@/hooks/use-posts";
import { Comment, Tag } from "@/types/posts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import DeletePost from "../../components/delete-post";
import UpdatePost from "../../components/update-post";

export default function PostDetailsPage() {
  const { postId } = useParams();
  const router = useRouter();

  const { data: dataCategories } = useCategoriesQuery();
  const categories = dataCategories?.data;
  const { data: datatags } = useTagsQuery();
  const tags = datatags?.data;
  const { data, isLoading, isError, refetch } = usePostByIdQuery(
    postId as string
  );
  const post = data?.post;

  const publishPostMutation = usePublishPostMutation();

  const publishPost = async () => {
    try {
      await publishPostMutation.mutateAsync({
        id: post.id,
        published: !post.published,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) return <LoadingSkeleton />;

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
        <CircleAlertIcon className="text-destructive" size={48} />
        <h3 className="text-xl font-semibold">
          {isError} Erreur de chargement
        </h3>
        <p className="text-muted-foreground">{isError}</p>
        <Button
          onClick={async () => {
            await refetch();
          }}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <section className="smp-6 py-4 px-2 size-full container max-w-[55rem] mx-auto flex flex-col gap-8">
      <div className="mx-auto">
        <div className="w-full space-y-6">
          <div className="flex items-start gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <MoveLeftIcon />
            </Button>
            <h2 className={`text-2xl font-bold px-2`}>{post.title}</h2>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-4 text-gray-500 text-sm my-4">
            <div className="flex">
              <UserIcon className="text-blue-500 mr-1" size={25} />{" "}
              <h3 className="text-lg font-semibold">
                Créer par <span>{post.author.name}</span>
              </h3>
            </div>
            <div className="flex">
              <CalendarIcon className="text-blue-500 mr-1" size={25} />
              <h3 className="text-lg font-semibold">
                <span>Date de création: {formatDate(post.createdAt)}</span>
              </h3>
            </div>
            <div className="flex">
              <CalendarIcon className="text-blue-500 mr-1" size={25} />
              <h3 className="text-lg font-semibold">
                <span>Dernière mise à jour: {formatDate(post.updatedAt)}</span>
              </h3>
            </div>
            <div className="flex">
              {post.published ? (
                <CheckCircleIcon className="text-blue-500 mr-1" size={25} />
              ) : (
                <CircleOffIcon className="text-red-500 mr-1" size={25} />
              )}
              <h3 className="text-lg font-semibold">
                Status: <span>Publié</span>
              </h3>
              {post.published ? (
                <Button
                  size={"sm"}
                  className="ml-3"
                  disabled={publishPostMutation.isPending}
                  onClick={publishPost}
                >
                  {publishPostMutation.isPending ? "En cours..." : "Retirer"}
                </Button>
              ) : (
                <Button
                  size={"sm"}
                  className="ml-3"
                  disabled={publishPostMutation.isPending}
                  onClick={publishPost}
                >
                  {publishPostMutation.isPending ? "En cours..." : "Publier"}
                </Button>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold">Actions</h2>
            <div className="flex gap-2">
              <UpdatePost post={post} categories={categories} tags={tags} />
              <DeletePost post={post} />
            </div>
            <div></div>
          </div>
        </div>

        <div className="flex flex-col gap-6 items-center w-full py-6">
          <div className="absolute top-8 left-0 z-20">
            <span className="inline-block bg-primary px-3.5 py-2.5 text-sm font-semibold text-white">
              {post.category.name}
            </span>
          </div>
          <div className="w-full h-72 overflow-hidden">
            <Image
              src={`${post.featuredImage}`}
              width={800}
              height={400}
              alt={post.title}
              className="size-full object-fill"
            />
          </div>

          <div className="w-full">
            <h2 className="text-xl font-bold">{post.title}</h2>
          </div>
          <div className="w-full">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>
          <div className="w-full flex">
            {post.tags.map((tag: Tag) => (
              <span
                key={tag.id}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                #{tag.name}
                
              </span>
            ))}
          </div>
        </div>

        {/* Comments comments	 */}
        <div className="py-4">
          <h2 className="text-lg font-semibold border-b">
            {post.comments.length} Commentaire
            {post.comments.length > 1 ? "s" : ""}
          </h2>
          <div className="flex flex-col gap-4 py-4">
            {post.comments.map((comment: Comment) => (
              <div key={comment.id} className="flex flex-col gap-0">
                <div>
                  <h3 className="text-lg flex items-center gap-2">
                    <span className="font-medium text-primary">
                      {comment.visitorName}
                    </span>{" "}
                    <span className="italic text-black font-light">
                      {formatDate(comment.createdAt)}
                    </span>
                    {comment.isApproved ? (
                      <CheckCircleIcon
                        className="text-blue-500 mr-1"
                        size={20}
                      />
                    ) : (
                      <CircleOffIcon className="text-red-500 mr-1" size={20} />
                    )}
                    <CommentMenu comment={comment} />
                  </h3>
                </div>
                <div>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <section className="p-6 sm:min-w-xs max-w-full mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-8 w-64 rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center space-y-2">
        <Skeleton className="h-16 w-32 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
      </div>
    </section>
  );
}

function CommentMenu({ comment }: { comment: Comment }) {
  const moderateCommentMutation = useModerateCommentMutation();
  const deleteCommentMutation = useDeleteCommentMutation();

  const moderateComment = async () => {
    try {
      await moderateCommentMutation.mutateAsync({
        postId: comment.postId,
        commentId: comment.id,
        action: comment.isApproved ? "reject" : "approve",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async () => {
    try {
      await deleteCommentMutation.mutateAsync({
        postId: comment.postId,
        commentId: comment.id,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"sm"}>
          <IconDotsVertical className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={moderateComment}>
            {comment.isApproved ? "Rejeter" : "Approver"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={deleteComment}
            className="bg-red-500 text-white focus:bg-red-600 focus:text-white transition-all"
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
