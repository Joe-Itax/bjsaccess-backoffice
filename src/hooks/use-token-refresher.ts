"use client"
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRefreshTokenMutation } from "./use-auth-user";

interface JwtPayload {
  exp: number;
}

export function useTokenRefresher() {
const { mutateAsync: refreshToken } = useRefreshTokenMutation();

  useEffect(() => {
    const interval = setInterval(async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshTokenStr = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshTokenStr) return;

    try {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    const expirationTime = decoded.exp * 1000; // en ms
    const currentTime = Date.now();
    const timeLeft = expirationTime - currentTime;

    if (timeLeft < 5 * 60 * 1000) {
        // Moins de 5 minutes restantes => refresh
        const result = await refreshToken(refreshTokenStr);
        localStorage.setItem("accessToken", result.accessToken);
        console.log("Token rafraîchi automatiquement !");
    }
    } catch (err) {
    console.error("Erreur de décodage ou de rafraîchissement :", err);
    }
    }, 1 * 60 * 1000); // toutes les minutes

    return () => clearInterval(interval);
  }, [refreshToken]);
}
