"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  EnrolledStudent,
  CanteenStudent,
  Notification,
  Meal,
} from "@/types/student";
import { useState } from "react";
import { useNotification } from "@/hooks/use-notification";

interface GetCanteenStudentsResponse {
  totalItems: number;
  limitPerPage: number;
  totalPages: number;
  currentPage: number;
  data: CanteenStudent[];
}

// === ENROLLED STUDENTS ===
export function useEnrolledStudentsQuery() {
  const { show } = useNotification();
  return useQuery({
    queryKey: ["enrolled-students"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/enrolled`,
          { credentials: "include" }
        );
        if (!res.ok) {
          show("error", "Erreur lors du chargement des élèves inscrits.");
          throw new Error("Erreur récupération des élèves inscrits");
        }
        const data = await res.json();
        return data.data as EnrolledStudent[];
      } catch (error) {
        console.error("Erreur lors du chargement des élèves inscrits: ", error);
        throw error;
      }
    },
  });
}

export function useSearchEnrolledStudentsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (query: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/enrolled/search?query=${query}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Erreur recherche des élèves inscrits");
      const data = await res.json();
      return data.data as EnrolledStudent[];
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["enrolled-students"], data);
    },
  });
}

export function useEnrolledStudentByIdQuery(id: string) {
  return useQuery({
    queryKey: ["enrolled-student", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/enrolled/${id}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Erreur récupération élève");
      const data = await res.json();
      return data.user as EnrolledStudent;
    },
  });
}

export function useUpdateEnrolledStudentMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<EnrolledStudent>;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/enrolled/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Erreur update élève");
      return res.json();
    },
    onSuccess: () => {
      show("success", "Élève mis à jour avec succès.");
      queryClient.invalidateQueries({ queryKey: ["enrolled-students"] });
    },
  });
}

// === CANTEEN STUDENTS ===

export function useCanteenStudentsQuery() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const query = useQuery<GetCanteenStudentsResponse>({
    queryKey: ["canteen-students", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen?page=${
            pagination.pageIndex + 1
          }&limit=${pagination.pageSize}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error(
            data.message || "Erreur lors du chargement des élèves cantine.",
            data
          );
          throw new Error("Erreur lors du chargement des élèves cantine.");
        }

        return data;
      } catch (error) {
        console.error("Erreur lors du chargement des élèves cantine: ", error);
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

export function useSearchCanteenStudentsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (query: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/search?query=${query}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          `Erreur recherche des élèves inscrits. Erreur: `,
          data.message
        );

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["canteen-students"], data.data);
    },
  });
}

export function useCanteenStudentByIdQuery(id: string) {
  return useQuery({
    queryKey: ["canteen-student", id],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/${id}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Erreur récupération élève");
        const data = await res.json();
        return data;
      } catch (error) {
        console.error(`Erreur: `, error);
      }
    },
  });
}

export function useAddCanteenStudentMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      enrolledStudentIds: string[];
      parentId: string;
    }) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();
        if (!res.ok) {
          show("error", data.message || "Erreur lors de l'ajout à la cantine.");
          throw new Error(
            data.message || "Erreur lors de l'ajout à la cantine."
          );
        }

        return data;
      } catch (error) {
        console.error("Erreur ajout multiple à la cantine :", error);
        throw error;
      }
    },

    onSuccess: (data) => {
      show(
        "success",
        data.message || "Élève(s) ajouté(s) à la cantine avec succès."
      );
      queryClient.invalidateQueries({
        queryKey: ["canteen-students"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["enrolled-students"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard-overview"],
        exact: false,
      });
    },

    onError: (error) => {
      show("error", error.message || "Erreur lors de l'ajout à la cantine.");
    },
  });
}

export function useReRegisterCanteenStudentMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (canteenStudentId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/re-register/${canteenStudentId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Erreur réinscription élève");
      return res.json();
    },
    onSuccess: () => {
      show("success", "Élève réinscrit à la cantine avec succès.");
      queryClient.invalidateQueries({
        queryKey: ["canteen-students"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["enrolled-students"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard-overview"],
        exact: false,
      });
    },
  });
}

export function useRemoveCanteenStudentMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (canteenStudentIds: string[]) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ canteenStudentIds }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        show("error", data.message || "Erreur lors de la désinscription.");
      }

      return data;
    },
    onSuccess: (data) => {
      show(
        "success",
        data.message || "Élève(s) désinscrit(s) de la cantine avec succès."
      );
      queryClient.invalidateQueries({
        queryKey: ["canteen-students"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["enrolled-students"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard-overview"],
        exact: false,
      });
    },
    onError: (error) => {
      show("error", error.message || "Erreur lors de la désinscription.");
    },
  });
}

export function useCanteenStudentsByParentQuery(parentId: string) {
  return useQuery({
    queryKey: ["canteen-students-by-parent", parentId],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/by-parent/${parentId}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Erreur élèves par parent");
        const data = await res.json();
        return data.data as CanteenStudent[];
      } catch (error) {
        console.error("Erreur lors du chargement des élèves cantine: ", error);
        throw error;
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBuySubscriptionMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      canteenStudentId,
      payload,
    }: {
      canteenStudentId: string;
      payload: { duration: number; price: number };
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/${canteenStudentId}/subscription`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Erreur achat abonnement");
      return res.json();
    },
    onSuccess: () => {
      show("success", "Abonnement acheté avec succès.");
      queryClient.invalidateQueries({
        queryKey: ["dashboard-overview"],
        exact: false,
      });
    },
    onError: () => {
      show("error", "Erreur lors de l'achat de l'abonnement.");
    },
  });
}

export function useScanQRCodeMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (matriculeHashe: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/scan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matriculeHashe }),
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Erreur scan QR Code");
      return res.json();
    },
    onSuccess: () => {
      show("success", "Repas pris avec succès.");
      queryClient.invalidateQueries({
        queryKey: ["dashboard-overview"],
        exact: false,
      });
    },
    onError: () => {
      show("error", "Erreur lors de la prise du repas.");
    },
  });
}

// === NOTIFICATIONS ===
export function useNotificationsQuery(canteenStudentId: string) {
  return useQuery({
    queryKey: ["notifications", canteenStudentId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/${canteenStudentId}/notifications`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Erreur récupération notifications");
      const data = await res.json();
      return data.data as Notification[];
    },
  });
}

export function useMarkAllNotificationsMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (canteenStudentId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/${canteenStudentId}/notifications`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Erreur marquage notifications");
      return res.json();
    },
    onSuccess: () => {
      show("success", "Notifications marquées lues !");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      show("error", "Erreur lors du marquage des notifications.");
    },
  });
}

export function useMarkOneNotificationMutation() {
  const { show } = useNotification();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      canteenStudentId,
      notificationId,
    }: {
      canteenStudentId: string;
      notificationId: number;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/${canteenStudentId}/notifications/${notificationId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Erreur marquage notification");
      return res.json();
    },
    onSuccess: () => {
      show("success", "Notification marquée lue !");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      show("error", "Erreur lors du marquage de la notification.");
    },
  });
}

// === MEAL HISTORY ===
export function useMealHistoryQuery(canteenStudentId: string) {
  return useQuery({
    queryKey: ["meal-history", canteenStudentId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/canteen/${canteenStudentId}/meal-history`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Erreur récupération historique repas");
      const data = await res.json();
      return data.data as Meal[];
    },
  });
}
