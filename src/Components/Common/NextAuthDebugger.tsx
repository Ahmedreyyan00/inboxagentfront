"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

const NextAuthDebugger = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only run in development or when explicitly enabled
    if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEBUG_NEXTAUTH === "true") {
      console.log("🔍 NextAuth Debugger Component Mounted");
      
      // Log environment variables (only in development)
      if (process.env.NODE_ENV === "development") {
        console.log("🌍 Environment Variables:", {
          NODE_ENV: process.env.NODE_ENV,
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
          NEXT_PUBLIC_DEBUG_NEXTAUTH: process.env.NEXT_PUBLIC_DEBUG_NEXTAUTH,
        });
      }

      // Log session status
      console.log("📋 Session Status:", {
        status,
        hasSession: !!session,
        sessionData: session,
        timestamp: new Date().toISOString(),
      });

      // Check for common issues
      if (status === "loading") {
        console.log("⏳ Session is loading...");
      } else if (status === "unauthenticated") {
        console.log("❌ User is not authenticated");
      } else if (status === "authenticated") {
        console.log("✅ User is authenticated");
        
        // Check for missing data
        if (!session?.user?.id) {
          console.warn("⚠️ Session missing user ID");
        }
        if (!session?.accessToken) {
          console.warn("⚠️ Session missing access token");
        }
      }

      // Log localStorage token
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        console.log("🔑 LocalStorage Token:", {
          exists: !!token,
          length: token?.length || 0,
        });
      }

      // Test API connectivity
      testApiConnectivity();
    }
  }, [session, status]);

  const testApiConnectivity = async () => {
    try {
      console.log("🧪 Testing API connectivity...");
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      console.log("📡 API Session Test:", {
        status: response.status,
        data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ API connectivity test failed:", error);
    }
  };

  // Don't render anything in production unless explicitly enabled
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_DEBUG_NEXTAUTH !== "true") {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: '#f0f0f0', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <strong>NextAuth Debug</strong>
      <br />
      Status: {status}
      <br />
      Has Session: {session ? "Yes" : "No"}
      <br />
      User ID: {session?.user?.id || "N/A"}
      <br />
      <button 
        onClick={() => {
          console.log("🔍 Manual Debug Trigger");
          testApiConnectivity();
        }}
        style={{ marginTop: '5px', padding: '2px 5px' }}
      >
        Test API
      </button>
    </div>
  );
};

export default NextAuthDebugger; 