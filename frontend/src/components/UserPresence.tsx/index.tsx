"use client";

import { api } from "@/src/lib/axios";
import { useEffect } from "react";

export function UserPresence() {
  useEffect(() => {
    const sendHeartbeat = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        await api.post("/users/me/heartbeat");
      } catch (error) {
        console.error("Erro ao atualizar status online:", error);
      }
    };

    void sendHeartbeat();

    const interval = setInterval(() => {
      void sendHeartbeat();
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  return null;
}