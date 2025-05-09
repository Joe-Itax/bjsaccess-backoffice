import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/hooks/use-notification";
import { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { revalidateAuthUser } from "@/lib/revalidate-auth-user";

export function useAuthUserQuery() {
  const { show } = useNotification();
  return useQuery<User>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user-state`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Échec de récupération de l'utilisateur.");
      }
      const data = await res.json();
      if (!data.user) {
        throw new Error("Aucun utilisateur connecté.");
      }
      show("note", `Connecté en tant que ${data.user.name}`);
      return data.user as User;
    },

    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

export function useLoginMutation() {
  const router = useRouter();
  const { show } = useNotification();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const dataReceived = await res.json();
      if (!res.ok) {
        throw new Error(dataReceived.message || "Échec de connexion");
      }
      return dataReceived;
    },
    onSuccess: (data) => {
      revalidateAuthUser();
      show("success", data.message || "Connecté avec succès !");
      router.replace("/dashboard");
    },
    onError: (error: Error) => {
      show(
        "error",
        error instanceof Error
          ? error.message
          : "Une erreur inconnue s'est produite"
      );
    },
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const { show } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(`Erreur de déconnexion: ${data.message}`);
      }
    },
    onSuccess: () => {
      show("note", "Déconnexion...");
      revalidateAuthUser();
      queryClient.removeQueries({ queryKey: ["auth-user"] });
      setTimeout(() => {
        router.replace("/login");
      }, 100);
    },
    onError: (error) => {
      show(
        "error",
        error.message || "Une erreur s'est produite lors de la déconnexion"
      );
    },
  });
}
