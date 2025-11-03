import axios from "axios";
import { getSession } from "next-auth/react";
import { handleRateLimitError } from "@/Utils/rateLimitHandler";
import toast from "react-hot-toast";

// Debug axios configuration
console.log("🔧 Axios Instance Configuration:");
console.log("- Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
console.log("- Environment:", process.env.NODE_ENV);
console.log("- With Credentials:", true);

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.smartle.eu/',
  // baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 300000, // 5 minutes timeout for long-running operations like invoice scanning
});

axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("📤 Axios Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      timestamp: new Date().toISOString(),
    });

    if (typeof window !== "undefined") {
      // Try to get token from NextAuth session first
      try {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers["Authorization"] = `Bearer ${session.accessToken}`;
          console.log("🔑 Added Authorization header with NextAuth token");
        } else {
          // Fallback to localStorage for backward compatibility
          const token = localStorage.getItem("token");
          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
            console.log("🔑 Added Authorization header with localStorage token");
          } else {
            console.log("⚠️ No token found in session or localStorage");
          }
        }
      } catch (error) {
        console.error("❌ Error getting session:", error);
        // Fallback to localStorage
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
          console.log("🔑 Added Authorization header with localStorage token (fallback)");
        }
      }
    }
    return config;
  },
  (error) => {
    console.error("❌ Axios Request Error:", {
      message: error.message,
      config: error.config,
      timestamp: new Date().toISOString(),
    });
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("📥 Axios Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      data: response.data,
      timestamp: new Date().toISOString(),
    });
    return response;
  },
  (error) => {
    console.error("❌ Axios Response Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      headers: error.response?.headers,
      timestamp: new Date().toISOString(),
    });

    // Handle rate limiting (429 Too Many Requests)
    if (error.response?.status === 429) {
      const rateLimitInfo = handleRateLimitError(error);
      console.warn("⏱️ Rate limit exceeded:", rateLimitInfo);
      
      // Show user-friendly toast message with retry time
      toast.error(rateLimitInfo.message, {
        duration: 5000,
        icon: "⏱️",
      });
      
      // Attach rate limit info to error for component-level handling
      error.rateLimitInfo = rateLimitInfo;
    }

    if (error.response?.status === 401) {
      console.warn("🚨 Unauthorized - maybe redirect to login");
    }

    // Log CORS errors specifically
    if (error.message?.includes("CORS") || error.message?.includes("cors")) {
      console.error("🌐 CORS Error detected - check your backend CORS configuration");
    }

    // Log network errors
    if (error.code === "NETWORK_ERROR" || error.message?.includes("Network Error")) {
      console.error("🌐 Network Error - check if backend is accessible");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
