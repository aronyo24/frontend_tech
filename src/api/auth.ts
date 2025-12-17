import { apiClient, setCsrfToken } from "@/api/apiClient";
import type {
  LoginResponse,
  LogoutResponse,
  PasswordResetResponse,
  RegisterResponse,
  ResendOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
  ProfileResponse,
  ProfileUpdatePayload,
} from "../types/interface";

const applyCsrfFromResponse = (data: unknown): void => {
  if (!data || typeof data !== "object") {
    return;
  }

  const token = (data as { csrf_token?: unknown }).csrf_token;
  if (token === undefined) {
    return;
  }

  if (typeof token === "string" && token.length > 0) {
    setCsrfToken(token);
  } else {
    setCsrfToken(null);
  }
};

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  age?: number;
  country?: string;
  country_code?: string;
  profession?: string;
  profile_image?: File | null;
}

export interface LoginPayload {
  username?: string;
  email?: string;
  password: string;
}

export type VerifyOtpRequest = VerifyOtpPayload;

export interface ResendOtpPayload {
  email?: string;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  email: string;
  otp_code: string;
  new_password: string;
  confirm_password: string;
}

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const formData = new FormData();

  formData.append("username", payload.username);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("confirm_password", payload.confirm_password);

  const appendIfString = (key: string, value: string | undefined) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  };

  appendIfString("first_name", payload.first_name);
  appendIfString("last_name", payload.last_name);
  appendIfString("phone_number", payload.phone_number);
  appendIfString("country", payload.country);
  appendIfString("country_code", payload.country_code);
  appendIfString("profession", payload.profession);

  if (typeof payload.age === "number" && Number.isFinite(payload.age)) {
    formData.append("age", String(payload.age));
  }

  if (payload.profile_image instanceof File) {
    formData.append("profile_image", payload.profile_image);
  }

  const { data } = await apiClient.post<RegisterResponse>("/auth/register/", formData);
  applyCsrfFromResponse(data);
  return data;
};

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>("/auth/login/", payload);
  applyCsrfFromResponse(data);
  return data;
};

export const verifyOtp = async (payload: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
  const { data } = await apiClient.post<VerifyOtpResponse>("/auth/verify-otp/", payload);
  applyCsrfFromResponse(data);
  return data;
};

export const resendOtp = async (payload: ResendOtpPayload): Promise<ResendOtpResponse> => {
  const { data } = await apiClient.post<ResendOtpResponse>("/auth/resend-otp/", payload);
  applyCsrfFromResponse(data);
  return data;
};

export const requestPasswordReset = async (
  payload: PasswordResetRequestPayload,
): Promise<PasswordResetResponse> => {
  const { data } = await apiClient.post<PasswordResetResponse>("/auth/forgot-password/", payload);
  applyCsrfFromResponse(data);
  return data;
};

export const resetPassword = async (
  payload: PasswordResetConfirmPayload,
): Promise<PasswordResetResponse> => {
  const { data } = await apiClient.post<PasswordResetResponse>("/auth/reset-password/", payload);
  applyCsrfFromResponse(data);
  return data;
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  const { data } = await apiClient.post<LogoutResponse>("/auth/logout/");
  setCsrfToken(null);
  applyCsrfFromResponse(data);
  return data;
};

export const fetchProfile = async (): Promise<ProfileResponse> => {
  const { data } = await apiClient.get<ProfileResponse>('/auth/profile/');
  applyCsrfFromResponse(data);
  return data;
};

export const updateProfile = async (payload: ProfileUpdatePayload): Promise<ProfileResponse> => {
  await ensureCsrfCookie();
  const hasFile = payload.profile_image instanceof File;
  if (!hasFile) {
    const body: Record<string, unknown> = {};

    if ('first_name' in payload) body.first_name = payload.first_name;
    if ('last_name' in payload) body.last_name = payload.last_name;
    if ('display_name' in payload) body.display_name = payload.display_name;
    if ('phone_number' in payload) body.phone_number = payload.phone_number;
    if ('age' in payload) body.age = payload.age;
    if ('country' in payload) body.country = payload.country;
    if ('country_code' in payload) body.country_code = payload.country_code;
    if ('profession' in payload) body.profession = payload.profession;
    if ('remove_profile_image' in payload) body.remove_profile_image = payload.remove_profile_image;

    const { data } = await apiClient.patch<ProfileResponse>('/auth/profile/', body);
    applyCsrfFromResponse(data);
    return data;
  }

  const formData = new FormData();

  const appendIfPresent = (key: string, value: unknown) => {
    if (value === undefined) {
      return;
    }
    if (value === null) {
      formData.append(key, '');
      return;
    }
    formData.append(key, value as string | Blob);
  };

  appendIfPresent('first_name', payload.first_name ?? undefined);
  appendIfPresent('last_name', payload.last_name ?? undefined);
  appendIfPresent('display_name', payload.display_name ?? undefined);
  appendIfPresent('phone_number', payload.phone_number ?? undefined);
  appendIfPresent('country', payload.country ?? undefined);
  appendIfPresent('country_code', payload.country_code ?? undefined);
  appendIfPresent('profession', payload.profession ?? undefined);

  if ('age' in payload) {
    appendIfPresent('age', payload.age === null ? '' : String(payload.age));
  }

  if (payload.profile_image instanceof File) {
    formData.append('profile_image', payload.profile_image);
  }

  if ('remove_profile_image' in payload) {
    appendIfPresent('remove_profile_image', payload.remove_profile_image ? 'true' : 'false');
  }

  const { data } = await apiClient.patch<ProfileResponse>('/auth/profile/', formData);
  applyCsrfFromResponse(data);
  return data;
};

export const getGoogleAuthUrl = (redirectPath = "/home"): string => {
  const rawBaseUrl = import.meta.env.VITE_GOOGLE_LOGIN_URL ??
    "https://socialmates-6aa3380f13f2.herokuapp.com/account/google/login/";

  const normalizedBaseUrl = (() => {
    try {
      const url = new URL(rawBaseUrl);
      // If someone accidentally points at the callback endpoint, upgrade it to the login entry point.
      if (url.pathname.endsWith("/login/callback") || url.pathname.endsWith("/login/callback/")) {
        url.pathname = url.pathname.replace(/\/login\/callback\/?$/, "/login/");
      }
      if (!url.pathname.endsWith("/login/") && !url.pathname.endsWith("/login")) {
        url.pathname = url.pathname.replace(/\/account\/google\/?$/, "/account/google/login/");
      }
      if (!url.pathname.endsWith("/")) {
        url.pathname = `${url.pathname}/`;
      }
      return url.toString();
    } catch (_error) {
      return "https://socialmates-6aa3380f13f2.herokuapp.com/account/google/login/";
    }
  })();

  const baseUrl = new URL(normalizedBaseUrl);
  const frontendOrigin = import.meta.env.VITE_FRONTEND_ORIGIN ?? window.location.origin;
  baseUrl.searchParams.set("process", "login");

  if (redirectPath) {
    const resolvedRedirect = new URL(redirectPath, frontendOrigin).toString();
    baseUrl.searchParams.set("next", resolvedRedirect);
  }

  return baseUrl.toString();
};

export async function ensureCsrfCookie(): Promise<void> {
  try {
    const { data } = await apiClient.get("/auth/status/");
    applyCsrfFromResponse(data);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed to prefetch CSRF cookie", error);
    }
  }
}