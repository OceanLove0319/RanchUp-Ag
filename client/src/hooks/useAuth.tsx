import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { api, setToken, clearToken, hasToken } from "@/lib/api";
import { useLocation } from "wouter";

type User = {
  id: string;
  email: string;
  name: string;
  org: string | null;
  role: string;
  status: string;
  onboarded: boolean;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; org?: string; role?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<{ name: string; org: string; onboarded: boolean }>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  // Check existing token on mount
  useEffect(() => {
    if (hasToken()) {
      api.get<{ user: User }>("/api/auth/me")
        .then(({ user }) => setUser(user))
        .catch(() => clearToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await api.post<{ user: User; token: string }>("/api/auth/login", { email, password });
    setToken(token);
    setUser(user);
  }, []);

  const register = useCallback(async (data: { email: string; password: string; name: string; org?: string; role?: string }) => {
    const { user, token } = await api.post<{ user: User; token: string }>("/api/auth/register", data);
    setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const updateProfile = useCallback(async (data: Partial<{ name: string; org: string; onboarded: boolean }>) => {
    const updated = await api.put<User>("/api/user/profile", data);
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
