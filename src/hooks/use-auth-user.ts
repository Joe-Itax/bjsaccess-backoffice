"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/hooks/use-notification";
import { User, AuthResponse } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Fonction pour stocker les tokens
const storeTokens = (data: AuthResponse) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  }
};

// Fonction pour récupérer le token
export const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken") || "";
  }
  return "";
};

export function useAuthUserQuery() {
  const { show } = useNotification();

  return useQuery<User | null>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const token = getAccessToken();
      const refreshToken = localStorage.getItem("refreshToken") || "";
      if (!token) return null;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/check-auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      const data = await res.json();

      // Si un nouveau token est fourni, le stocker
      if (data.tokenRefresh?.newAccessToken) {
        localStorage.setItem("accessToken", data.tokenRefresh.newAccessToken);
      }

      if (!res.ok) {
        throw new Error("Échec de récupération de l'utilisateur");
      }

      show(
        "note",
        `Connecté en tant que ${data.user.name} - ${data.user.role}`
      );
      return data.user as User;
    },
  });
}

export function useLoginMutation() {
  const router = useRouter();
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Échec de connexion");
      }

      return (await res.json()) as AuthResponse;
    },
    onSuccess: (data) => {
      storeTokens(data);
      queryClient.setQueryData(["auth-user"], data.user);
      show("success", "Connexion réussie !");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      show("error", error.message || "Erreur de connexion");
    },
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = getAccessToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Échec de déconnexion");
      }
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.setQueryData(["auth-user"], null);
      show("success", "Déconnexion réussie");
      router.push("/login");
    },
    onError: (error: Error) => {
      show("error", error.message || "Erreur de déconnexion");
    },
  });
}

export function useRefreshTokenMutation() {
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!res.ok) {
        throw new Error("Échec du rafraîchissement du token");
      }

      return (await res.json()) as { accessToken: string };
    },
  });
}
