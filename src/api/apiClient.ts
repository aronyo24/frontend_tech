import axios, { AxiosHeaders } from "axios";

const DEFAULT_API_BASE_URL = (() => {
  const explicitBase = import.meta.env.VITE_API_BASE_URL;
  if (explicitBase && explicitBase.length > 0) {
    return explicitBase;
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol || "http:";
    const hostname = window.location.hostname || "127.0.0.1";
    const defaultPort = "8000";
    const configuredPort = import.meta.env.VITE_API_PORT;
    const port = configuredPort && configuredPort.length > 0 ? configuredPort : defaultPort;
    return `${protocol}//${hostname}:${port}/`;
  }

  return "http://127.0.0.1:8000/";
})();

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