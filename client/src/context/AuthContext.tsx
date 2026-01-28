import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authAPI, userAPI } from "@/services/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  hasCompletedHealthProfile?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Load user on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("fiteats_token");
        if (!token) return;

        const res = await authAPI.me();
        setUser(res.data.user || res.data);
      } catch {
        localStorage.removeItem("fiteats_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);

    // ✅ FIX: correct token key
    const { accessToken, user: userData } = res.data;

    localStorage.setItem("fiteats_token", accessToken);
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authAPI.register(name, email, password);

    const { accessToken, user: userData } = res.data;

    localStorage.setItem("fiteats_token", accessToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      localStorage.removeItem("fiteats_token");
      setUser(null);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const res = await userAPI.updateProfile(data);
      // Update local user state with new data
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
