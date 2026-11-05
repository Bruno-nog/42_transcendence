import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token)
    config.headers.Authorization = `Bearer ${token}`;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");

      const pathSegments = window.location.pathname.split("/").filter(Boolean);
      const locale = pathSegments[0];
      const loginPath =
        locale === "pt" || locale === "en" ? `/${locale}/login` : "/login";

      if (window.location.pathname !== loginPath) {
        window.location.replace(loginPath);
      }
    }

    return Promise.reject(error);
  },
);