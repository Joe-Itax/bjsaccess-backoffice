import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user";
import { useNotification } from "./use-notification";
import { useState } from "react";

interface GetUsersResponse {
  totalItems: number;
  limitPerPage: number;
  totalPages: number;
  currentPage: number;
  data: User[];
}

// Récupérer tous les users
/*
export function useUsersQuery() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur lors du fetch des utilisateurs");
      const data = await res.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
*/
export function useUsersQuery() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const query = useQuery<GetUsersResponse>({
    queryKey: ["users", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?page=${
            pagination.pageIndex + 1
          }&limit=${pagination.pageSize}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!res.ok) {
          console.error(
            data.message || "Erreur lors du fetch des utilisateurs: ",
            data
          );
          throw new Error("Erreur lors du chargement des élèves cantine.");
        }
        return data;
      } catch (error) {
        console.error("Erreur lors du fetch des utilisateurs: ", error);
        throw error;
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  const setPage = (pageIndex: number) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex,
    }));
  };

  const setPageSize = (pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize,
    }));
  };

  return {
    ...query,
    pagination,
    setPage,
    setPageSize,
  };
}

// Récupérer un user par son id
export function useUserQuery(userId: string) {
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Erreur lors du fetch de l'utilisateur");
        const data = await res.json();

        return data.user;
      } catch (error) {
        console.error("Erreur lors du fetch de l'utilisateur: ", error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// Ajouter un user
export function useAddUserMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Partial<User>) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de l'ajout");
      }
      return data;
    },
    onSuccess: (data) => {
      show("success", data.message || "Utilisateur ajouté avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      show("error", error.message || "Erreur lors de l'ajout de l'utilisateur");
    },
  });
}

// Supprimer un user
export function useDeleteUserMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Erreur lors de la suppression");
      return data;
    },
    onSuccess: (data) => {
      show("success", data.message || "Utilisateur supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      show(
        "error",
        error.message || "Erreur lors de la suppression de l'utilisateur"
      );
    },
  });
}

// Rechercher des users
export function useSearchUsersMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (query: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/search?query=${query}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          `Erreur recherche d'utilisateurs. Erreur: `,
          data.message
        );
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["users"], data.data);
    },
  });
}

// Mettre à jour un user
export function useUpdateUserMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Partial<User>) => {
      const { id, ...payload } = user;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      return res.json();
    },
    onSuccess: (data) => {
      show("success", data.message || "Utilisateur mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
    onError: (error) => {
      show(
        "error",
        error.message || "Erreur lors de la mise à jour de l'utilisateur"
      );
    },
  });
}
