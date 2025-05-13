"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// import { useState } from "react";
import { useNotification } from "@/hooks/use-notification";
import { getAccessToken } from "./use-auth-user";
import { Category, Post, Tag } from "@/types/posts";
import { useRouter } from "next/navigation";

const token = getAccessToken();

export function usePostsQuery() {
  const { show } = useNotification();
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          show("error", "Erreur lors du chargement des articles.");
          throw new Error("Erreur récupération des articles");
        }
        const data = await res.json();
        return data.data;
      } catch (error) {
        console.error("Erreur lors du chargement des articles: ", error);
        throw error;
      }
    },
  });
}

export function useSearchPostsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (query: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/search?q=${query}`,
        {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Erreur recherche des articles");
      const data = await res.json();
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["posts"], data);
    },
  });
}

export function usePostByIdQuery(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${id}`,
        {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Erreur récupération de l'article");
      const data = await res.json();
      return data;
    },
  });
}

export function usePostByCategoryQuery(slug: string) {
  return useQuery({
    queryKey: ["posts", slug],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/category/${slug}`,
        {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok)
        throw new Error("Erreur récupération des articles de cette catégorie");
      const data = await res.json();
      return data;
    },
  });
}

export function usePostByTagsQuery(slug: string) {
  return useQuery({
    queryKey: ["posts", slug],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/tag/${slug}`,
        {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok)
        throw new Error("Erreur récupération des articles de ces tags");
      const data = await res.json();
      return data;
    },
  });
}

export function useCreatePostMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: Partial<Post>) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/admin`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(post),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || "Erreur lors de la création de l'article"
        );
      }
      return data;
    },
    onSuccess: (data) => {
      show("success", data.message || "Article créer avec succès");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      show("error", error.message || "Erreur lors de la création de l'article");
    },
  });
}

export function useUpdatePostMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: Partial<Post>) => {
      const { id, ...payload } = post;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/admin/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      return res.json();
    },

    onSuccess: (data) => {
      show("success", data.message || "Article mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error) => {
      show(
        "error",
        error.message || "Erreur lors de la mise à jour de l'article"
      );
    },
  });
}

export function usePublishPostMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: Partial<Post>) => {
      const { id, published } = post;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/admin/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ published }),
        }
      );
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      return res.json();
    },

    onSuccess: (data) => {
      if (data.post.published) {
        show("success", "Article publié !");
      } else {
        show("note", "Article retiré de la publication!");
      }
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error) => {
      show(
        "error",
        error.message || "Erreur lors de la publication de l'article"
      );
    },
  });
}

export function useDeletePostMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (postId: string) => {
      const token = getAccessToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/admin/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Échec de la suppression");
      }

      return await res.json();
    },
    onSuccess: (data) => {
      show("success", data.message || "Article supprimé définitivement");

      // Invalider les requêtes affectées
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      router.push("/dashboard/posts");
    },
    onError: (error: Error) => {
      show("error", error.message || "Erreur lors de la suppression");
    },
  });
}

export function useDeleteCommentMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, commentId }: { postId: string; commentId: string }) => {
      const token = getAccessToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/admin/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Échec de la suppression");
      }

      return await res.json();
    },
    onSuccess: (data) => {
      show("success", data.message || "Commentaire supprimé");

      // Invalider les requêtes affectées
      queryClient.invalidateQueries({ queryKey: ["post"] });

    },
    onError: (error: Error) => {
      show("error", error.message || "Erreur lors de la suppression");
    },
  });
}

export function useModerateCommentMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      commentId,
      action
    }: {
      postId: string;
      commentId: string;
      action: string;
    }) => {
      const token = getAccessToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/admin/${postId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({action}),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Échec de la moderation");
      }

      return await res.json();
    },
    onSuccess: (data) => {
      show("success", data.message || "Commentaire moderé");

      // Invalider les requêtes affectées
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error: Error) => {
      show("error", error.message || "Erreur lors de la moderation");
    },
  });
}


// Category
export function useCategoriesQuery() {
  const { show } = useNotification();
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/categories/all`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          show("error", "Erreur lors du chargement des categories.");
          throw new Error("Erreur récupération des categories");
        }
        const data = await res.json();
        return data.categories;
      } catch (error) {
        console.error("Erreur lors du chargement des categories: ", error);
        throw error;
      }
    },
  });
}
export function useCreateCategoryMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Partial<Category>) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/admin/categories`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(category),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || "Erreur lors de la création de la catégorie"
        );
      }
      return data;
    },
    onSuccess: (data) => {
      show("success", data.message || "Catégorie créer avec succès");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      show(
        "error",
        error.message || "Erreur lors de la création de la catégorie"
      );
    },
  });
}

// Tags
export function useTagsQuery() {
  const { show } = useNotification();
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/tags/all`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          show("error", "Erreur lors du chargement des tags.");
          throw new Error("Erreur récupération des tags");
        }
        const data = await res.json();
        return data.tags;
      } catch (error) {
        console.error("Erreur lors du chargement des tags: ", error);
        throw error;
      }
    },
  });
}
export function useCreateTagMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tag: Partial<Tag>) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/admin/tags`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tag),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || "Erreur lors de la création du Tag"
        );
      }
      return data;
    },
    onSuccess: (data) => {
      show("success", data.message || "Tag créer avec succès");
      queryClient.invalidateQueries({ queryKey: ["tag"] });
    },
    onError: (error) => {
      show(
        "error",
        error.message || "Erreur lors de la création du Tag"
      );
    },
  });
}

// export function useUpdateEnrolledStudentMutation() {
//   const { show } = useNotification();
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({
//       id,
//       payload,
//     }: {
//       id: string;
//       payload: Partial<EnrolledStudent>;
//     }) => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/enrolled/${id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//           credentials: "include",
//         }
//       );
//       if (!res.ok) throw new Error("Erreur update élève");
//       return res.json();
//     },
//     onSuccess: () => {
//       show("success", "Élève mis à jour avec succès.");
//       queryClient.invalidateQueries({ queryKey: ["enrolled-students"] });
//     },
//   });
// }

// // === CANTEEN STUDENTS ===

// export function useCanteenStudentsQuery() {
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const query = useQuery<GetCanteenStudentsResponse>({
//     queryKey: ["canteen-students", pagination.pageIndex, pagination.pageSize],
//     queryFn: async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen?page=${
//             pagination.pageIndex + 1
//           }&limit=${pagination.pageSize}`,
//           {
//             credentials: "include",
//           }
//         );

//         const data = await res.json();

//         if (!res.ok) {
//           console.error(
//             data.message || "Erreur lors du chargement des élèves cantine.",
//             data
//           );
//           throw new Error("Erreur lors du chargement des élèves cantine.");
//         }

//         return data;
//       } catch (error) {
//         console.error("Erreur lors du chargement des élèves cantine: ", error);
//         throw error;
//       }
//     },
//     placeholderData: (previousData) => previousData,
//     staleTime: 5 * 60 * 1000,
//   });

//   const setPage = (pageIndex: number) => {
//     setPagination((prev) => ({
//       ...prev,
//       pageIndex,
//     }));
//   };

//   const setPageSize = (pageSize: number) => {
//     setPagination((prev) => ({
//       ...prev,
//       pageSize,
//     }));
//   };

//   return {
//     ...query,
//     pagination,
//     setPage,
//     setPageSize,
//   };
// }

// export function useSearchCanteenStudentsMutation() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (query: string) => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/search?query=${query}`,
//         { credentials: "include" }
//       );
//       const data = await res.json();
//       if (!res.ok)
//         throw new Error(
//           `Erreur recherche des élèves inscrits. Erreur: `,
//           data.message
//         );

//       return data;
//     },
//     onSuccess: (data) => {
//       queryClient.setQueryData(["canteen-students"], data.data);
//     },
//   });
// }

// export function useCanteenStudentByIdQuery(id: string) {
//   return useQuery({
//     queryKey: ["canteen-student", id],
//     queryFn: async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/${id}`,
//           { credentials: "include" }
//         );
//         if (!res.ok) throw new Error("Erreur récupération élève");
//         const data = await res.json();
//         return data;
//       } catch (error) {
//         console.error(`Erreur: `, error);
//       }
//     },
//   });
// }

// export function useAddCanteenStudentMutation() {
//   const { show } = useNotification();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (payload: {
//       enrolledStudentIds: string[];
//       parentId: string;
//     }) => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             credentials: "include",
//             body: JSON.stringify(payload),
//           }
//         );

//         const data = await res.json();
//         if (!res.ok) {
//           show("error", data.message || "Erreur lors de l'ajout à la cantine.");
//           throw new Error(
//             data.message || "Erreur lors de l'ajout à la cantine."
//           );
//         }

//         return data;
//       } catch (error) {
//         console.error("Erreur ajout multiple à la cantine :", error);
//         throw error;
//       }
//     },

//     onSuccess: (data) => {
//       show(
//         "success",
//         data.message || "Élève(s) ajouté(s) à la cantine avec succès."
//       );
//       queryClient.invalidateQueries({
//         queryKey: ["canteen-students"],
//         exact: false,
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["enrolled-students"],
//         exact: false,
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["dashboard-overview"],
//         exact: false,
//       });
//     },

//     onError: (error) => {
//       show("error", error.message || "Erreur lors de l'ajout à la cantine.");
//     },
//   });
// }

// export function useReRegisterCanteenStudentMutation() {
//   const { show } = useNotification();
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (canteenStudentId: string) => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/re-register/${canteenStudentId}`,
//         {
//           method: "POST",
//           credentials: "include",
//         }
//       );
//       if (!res.ok) throw new Error("Erreur réinscription élève");
//       return res.json();
//     },
//     onSuccess: () => {
//       show("success", "Élève réinscrit à la cantine avec succès.");
//       queryClient.invalidateQueries({
//         queryKey: ["canteen-students"],
//         exact: false,
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["enrolled-students"],
//         exact: false,
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["dashboard-overview"],
//         exact: false,
//       });
//     },
//   });
// }

// export function useRemoveCanteenStudentMutation() {
//   const { show } = useNotification();
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (canteenStudentIds: string[]) => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen`,
//         {
//           method: "DELETE",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ canteenStudentIds }),
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) {
//         show("error", data.message || "Erreur lors de la désinscription.");
//       }

//       return data;
//     },
//     onSuccess: (data) => {
//       show(
//         "success",
//         data.message || "Élève(s) désinscrit(s) de la cantine avec succès."
//       );
//       queryClient.invalidateQueries({
//         queryKey: ["canteen-students"],
//         exact: false,
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["enrolled-students"],
//         exact: false,
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["dashboard-overview"],
//         exact: false,
//       });
//     },
//     onError: (error) => {
//       show("error", error.message || "Erreur lors de la désinscription.");
//     },
//   });
// }

// export function useCanteenStudentsByParentQuery(parentId: string) {
//   return useQuery({
//     queryKey: ["canteen-students-by-parent", parentId],
//     queryFn: async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/by-parent/${parentId}`,
//           { credentials: "include" }
//         );
//         if (!res.ok) throw new Error("Erreur élèves par parent");
//         const data = await res.json();
//         return data.data as CanteenStudent[];
//       } catch (error) {
//         console.error("Erreur lors du chargement des élèves cantine: ", error);
//         throw error;
//       }
//     },
//     placeholderData: (previousData) => previousData,
//     staleTime: 5 * 60 * 1000,
//   });
// }

// export function useBuySubscriptionMutation() {
//   const { show } = useNotification();
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({
//       canteenStudentId,
//       payload,
//     }: {
//       canteenStudentId: string;
//       payload: { duration: number; price: number };
//     }) => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/${canteenStudentId}/subscription`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//           credentials: "include",
//         }
//       );
//       if (!res.ok) throw new Error("Erreur achat abonnement");
//       return res.json();
//     },
//     onSuccess: () => {
//       show("success", "Abonnement acheté avec succès.");
//       queryClient.invalidateQueries({
//         queryKey: ["dashboard-overview"],
//         exact: false,
//       });
//     },
//     onError: () => {
//       show("error", "Erreur lors de l'achat de l'abonnement.");
//     },
//   });
// }

// export function useScanQRCodeMutation() {
//   const { show } = useNotification();
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (matriculeHashe: string) => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/scan`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ matriculeHashe }),
//           credentials: "include",
//         }
//       );
//       if (!res.ok) throw new Error("Erreur scan QR Code");
//       return res.json();
//     },
//     onSuccess: () => {
//       show("success", "Repas pris avec succès.");
//       queryClient.invalidateQueries({
//         queryKey: ["dashboard-overview"],
//         exact: false,
//       });
//     },
//     onError: () => {
//       show("error", "Erreur lors de la prise du repas.");
//     },
//   });
// }

// // === NOTIFICATIONS ===
// export function useNotificationsQuery(canteenStudentId: string) {
//   return useQuery({
//     queryKey: ["notifications", canteenStudentId],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/${canteenStudentId}/notifications`,
//         { credentials: "include" }
//       );
//       if (!res.ok) throw new Error("Erreur récupération notifications");
//       const data = await res.json();
//       return data.data as Notification[];
//     },
//   });
// }

// export function useMarkAllNotificationsMutation() {
//   const { show } = useNotification();
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (canteenStudentId: string) => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/${canteenStudentId}/notifications`,
//         {
//           method: "PATCH",
//           credentials: "include",
//         }
//       );
//       if (!res.ok) throw new Error("Erreur marquage notifications");
//       return res.json();
//     },
//     onSuccess: () => {
//       show("success", "Notifications marquées lues !");
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//     },
//     onError: () => {
//       show("error", "Erreur lors du marquage des notifications.");
//     },
//   });
// }

// export function useMarkOneNotificationMutation() {
//   const { show } = useNotification();
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({
//       canteenStudentId,
//       notificationId,
//     }: {
//       canteenStudentId: string;
//       notificationId: number;
//     }) => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/${canteenStudentId}/notifications/${notificationId}`,
//         {
//           method: "PATCH",
//           credentials: "include",
//         }
//       );
//       if (!res.ok) throw new Error("Erreur marquage notification");
//       return res.json();
//     },
//     onSuccess: () => {
//       show("success", "Notification marquée lue !");
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//     },
//     onError: () => {
//       show("error", "Erreur lors du marquage de la notification.");
//     },
//   });
// }

// // === MEAL HISTORY ===
// export function useMealHistoryQuery(canteenStudentId: string) {
//   return useQuery({
//     queryKey: ["meal-history", canteenStudentId],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/${canteenStudentId}/meal-history`,
//         { credentials: "include" }
//       );
//       if (!res.ok) throw new Error("Erreur récupération historique repas");
//       const data = await res.json();
//       return data.data as Meal[];
//     },
//   });
// }
