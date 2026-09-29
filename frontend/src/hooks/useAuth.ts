"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/";
  }

  const isAuthenticated = Boolean(token);

  return {
    token,
    isAuthenticated,
    isLoading,
    logout,
  };
}