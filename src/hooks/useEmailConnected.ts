import { useState, useEffect } from "react";
import Api from "@/lib/Api";

export interface EmailConnectionStatus {
  google?: {
    isActive: boolean;
    email: string;
    isReauthRequired?: boolean;
  }[];
  tokenStatus?: {
    hasRefreshToken: boolean;
    isTokenExpired: boolean;
    requiresReauth: boolean;
  };
  imap?: {
    isActive: boolean;
    email: string;
    password: string;
    host: string;
    port: number;
    useTLS: boolean;
  }[];
  microsoft?: {
    isActive: boolean;
    email: string;
    isReauthRequired?: boolean;
  }[];
}

const useEmailConnected = () => {
  const [emailStatus, setEmailStatus] = useState<EmailConnectionStatus | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    fetchEmailStatus();
  };

  const fetchEmailStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Api.getEmailConnectedStatus();
      setEmailStatus(response.data);
    } catch (err) {
      console.error("Error fetching email connection status:", err);
      setError("Failed to fetch email connection status");
    } finally {
      setLoading(false);
    }
  };

  const disconnectGmail = async (email: string) => {
    try {
      await Api.disconnectGmail(email);
      await fetchEmailStatus(); // Refresh status after disconnecting
    } catch (err) {
      console.error("Error disconnecting Gmail:", err);
      throw err;
    }
  };

  const disconnectMicrosoft = async (email: string) => {
    try {
      await Api.disconnectMicrosoft(email);
      await fetchEmailStatus(); // Refresh status after disconnecting
    } catch (err) {
      console.error("Error disconnecting Microsoft:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchEmailStatus();
  }, []);

  return {
    emailStatus,
    loading,
    error,
    fetchEmailStatus,
    disconnectGmail,
    disconnectMicrosoft,
    refresh,
  };
};

export default useEmailConnected;
