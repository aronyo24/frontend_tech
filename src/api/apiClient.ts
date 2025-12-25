import axios, { AxiosHeaders } from "axios";

const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

let csrfToken: string | null = null;

export const setCsrfToken = (token: string | null) => {
  csrfToken = token ?? null;
};

export const apiClient = axios.create({
  baseURL: DEFAULT_API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

apiClient.interceptors.request.use((config) => {
  if (config.withCredentials !== true) {
    config.withCredentials = true;
  }

  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers ?? {});

  if (config.data instanceof FormData) {
    headers.delete("Content-Type");
  } else if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (csrfToken && !headers.has("X-CSRFToken")) {
    headers.set("X-CSRFToken", csrfToken);
  }

  config.headers = headers;

  return config;
});