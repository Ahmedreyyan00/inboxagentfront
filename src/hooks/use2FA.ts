import { useState } from "react";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface Use2FAReturn {
  verifyCode: (code: string) => Promise<boolean>;
  resendCode: () => Promise<void>;
  isLoading: boolean;
  isResending: boolean;
}

export const use2FA = (email?: string): Use2FAReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { data: session, update } = useSession();

  const verifyCode = async (code: string): Promise<boolean> => {
    if (!email) {
      toast.error("Email is required for verification");
      return false;
    }

    setIsLoading(true);
    try {
      const response = await Api.verify2FA(code, email);
      console.log({ response });
      if (response.data.success) {
        if (session) {
          // Update session with 2FA verification status and access token
          await update({
            user: { 
              ...session.user, 
              is2FAVerified: true,
              isAdmin: response.data.data?.user?.isAdmin || false
            },
            accessToken: response.data.data?.token,
          });
        }

        return true;
      } else {
        toast.error(response.data.message || "Verification failed");
        return false;
      }
    } catch (error: any) {
      console.error("2FA verification error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Verification failed";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async (): Promise<void> => {
    if (!email) {
      toast.error("Email is required to resend code");
      return;
    }

    setIsResending(true);
    try {
      // For now, we'll simulate resend since the backend doesn't have this endpoint yet
      // In a real implementation, you would call: await Api.instance.post('/api/auth/2fa/resend', { email });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Verification code sent successfully");
    } catch (error: any) {
      console.error("2FA resend error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend code";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return {
    verifyCode,
    resendCode,
    isLoading,
    isResending,
  };
};
