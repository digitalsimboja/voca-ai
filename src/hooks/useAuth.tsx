"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/apiService";

interface User {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  businessType: "banking" | "retail";
  role: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    userData: SignupData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface SignupData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  businessType: "banking" | "retail";
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data?.user) {
          setUser(data.data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Backend routes may return either { data: { user: {...} } } or { data: {...} }
        const normalizedUser = data?.data?.user ?? data?.data ?? null;
        setUser(normalizedUser);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          email: userData.email,
          password: userData.password,
          companyName: userData.companyName,
          businessType: userData.businessType,
          agreeToMarketing: userData.agreeToMarketing,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const normalizedUser = data?.data?.user ?? data?.data ?? null;
        setUser(normalizedUser);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Signup failed:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear all Voca AI data using API service
      try {
        const result = await apiService.clearLocalStorage();
        if (result.status === 'success') {
          console.log(
            "Cleared localStorage on logout:",
            result.message
          );
        } else {
          console.error(
            "Failed to clear localStorage on logout:",
            result.message
          );
        }
      } catch (error) {
        console.error("Failed to clear localStorage on logout:", error);
      }

      setUser(null);
      router.push("/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
