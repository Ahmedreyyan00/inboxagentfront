"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
        return { success: true };
      }

      return { 
        success: false, 
        error: result?.error || "Login failed" 
      };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: "An unexpected error occurred" 
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear all storage first
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from NextAuth
      await signOut({ 
        callbackUrl: "/login",
        redirect: true 
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if signOut fails
      window.location.href = "/login";
    }
  };

  return {
    session,
    status,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated: !!session,
    isLoading: status === "loading",
  };
};
