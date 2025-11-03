"use client";

import { handleDashboardAuth } from "@/helpers/AuthHelper";
import { fetchInvoiceData } from "@/helpers/InvoiceHelper";
import { AppDispatch } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FullPageSkeleton } from "@/Components/ui/skeleton-loaders";

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ["/landing", "/login", "/signup", "/forgot-password", "/reset-password", "/",'/about','/contact'];

export function ProfieApi({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  
  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  
  console.log("🔍 PROFILEAPI DEBUG:", {
    pathname,
    isPublicRoute,
    hasSession: !!session,
    hasAccessToken: !!session?.accessToken,
    loading
  });
  
  const init = useCallback(async () => {
    // Skip authentication for public routes
    if (isPublicRoute) {
      console.log("✅ PROFILEAPI: Skipping auth check for public route:", pathname);
      setLoading(false);
      return;
    }

    console.log("🔐 PROFILEAPI: Running authentication check for:", pathname);
    try {
      const result = await handleDashboardAuth(
        session?.accessToken,
        setLoading,
        router,
        dispatch
      );
      console.log("📋 PROFILEAPI: handleDashboardAuth result:", result);
      if (!result) {
        setLoading(false);
        return;
      }
      await Promise.all([await fetchInvoiceData(dispatch)]);
      console.log("✅ PROFILEAPI: Authentication and data fetch completed");
    } catch (error) {
      console.error("❌ PROFILEAPI: Initialization error:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, router, dispatch, isPublicRoute, pathname]);

  useEffect(() => {
    // Skip authentication check for public routes
    if (isPublicRoute) {
      console.log("✅ PROFILEAPI: Skipping auth check in useEffect for public route:", pathname);
      setLoading(false);
      return;
    }

    if (session?.accessToken) {
      console.log("🔄 PROFILEAPI: Session detected, running init with delay");
      // Small delay to ensure session is fully updated, especially after 2FA
      const timer = setTimeout(() => {
        init();
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      console.log("⚠️ PROFILEAPI: No session access token found");
    }
  }, [session?.accessToken, init, isPublicRoute, pathname]);

  if (loading) {
    console.log("⏳ PROFILEAPI: Showing loading skeleton");
    return <FullPageSkeleton />;
  }
  return <>{children}</>;
}
