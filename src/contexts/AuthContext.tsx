import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { ReactNode } from "react";
import type { AuthUser } from "@/types/interface";
import { ensureCsrfCookie, fetchProfile, logoutUser } from "@/api/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const storageKey = "technoheaven:auth-user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch (_error) {
    return null;
  }
};

const persistUser = (value: AuthUser | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (value) {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } else {
    window.localStorage.removeItem(storageKey);
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUserState] = useState<AuthUser | null>(() => readStoredUser());
  const [loading, setLoading] = useState<boolean>(true);

  const setUser = useCallback((next: AuthUser | null) => {
    setUserState(next);
    persistUser(next);
  }, []);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      await ensureCsrfCookie();
      const response = await fetchProfile();
      setUser(response.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status !== 401 && status !== 403) {
          return;
        }
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (_error) {
      // Ignore network errors during logout; clear local session regardless.
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      setUser,
      logout,
      refreshUser,
      loading,
    }),
    [loading, logout, refreshUser, setUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
