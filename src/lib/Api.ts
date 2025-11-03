import axios from "axios";
import { AxiosInstance } from "axios";
// Use the environment variable directly for the API base URL
import { getSession } from "next-auth/react";
import { handleRateLimitError } from "@/Utils/rateLimitHandler";
import toast from "react-hot-toast";

class API {
  private instance: AxiosInstance;
  private publicInstance: AxiosInstance;

  constructor(token?: string) {
    // Authenticated instance for protected routes
    console.log(
      "backend url",process.env.NEXT_PUBLIC_API_BASE_URL);
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      headers: {
        Authorization: token,
      },
      timeout: 300000, // 5 minutes timeout for long-running operations like invoice scanning
    });

    // Public instance for authentication-related requests
    this.publicInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 300000, // 5 minutes timeout for long-running operations
    });

    this.setInterceptor();
  }

  setInterceptor() {
    this.instance.interceptors.request.use(
      async (config) => {
        const session = await getSession();
        const localStorageSavedIp = localStorage.getItem("clientIp");
        if (localStorageSavedIp) {
          config.headers["X-Client-IP"] = localStorageSavedIp;
        } else {
          const { data } = await axios.get(
            "https://api.ipify.org?format=json",
            {
              timeout: 5000,
            }
          );
          localStorage.setItem("clientIp", data.ip);
          config.headers["X-Client-IP"] = data.ip;
        }
        if (session?.accessToken) {
          config.headers.Authorization = session.accessToken;
        } else {
          console.log("No session or access token found:", { session, config });
          throw new Error("No authorization token found!");
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for rate limiting
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 429) {
          const rateLimitInfo = handleRateLimitError(error);
          toast.error(rateLimitInfo.message, {
            duration: 5000,
            icon: "⏱️",
          });
          error.rateLimitInfo = rateLimitInfo;
        }
        return Promise.reject(error);
      }
    );

    // Add response interceptor for public instance too
    this.publicInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 429) {
          const rateLimitInfo = handleRateLimitError(error);
          toast.error(rateLimitInfo.message, {
            duration: 5000,
            icon: "⏱️",
          });
          error.rateLimitInfo = rateLimitInfo;
        }
        return Promise.reject(error);
      }
    );
  }

  getProfile() {
    return this.instance.get("/api/auth/profile");
  }
  getInvoiceData(page: number = 1, limit: number = 10) {
    return this.instance.get("/api/client-data/invoices", {
      params: { page, limit },
    });
  }

  getDashboardStats() {
    return this.instance.get("/api/dashboard/stats");
  }

  googleAuth() {
    return this.instance.post("/api/mail/link-gmail");
  }

  getEmailConnectedStatus() {
    return this.instance.get("/api/mail/email-connected-status");
  }

  saveAutomationSetting(payload: any) {
    return this.instance.put("/api/user/update-automation-settings", {
      payload,
    });
  }

  getAutomationSettings() {
    return this.instance.get("/api/user/automation-settings");
  }

  updatePersonalInfo(payload: any) {
    return this.instance.put("/api/user/account-settings/personal-details", {
      payload,
    });
  }
  updatePassword({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) {
    return this.instance.put("/api/user/account-settings/update-password", {
      oldPassword,
      newPassword,
    });
  }

  getAccountSettings() {
    return this.instance.get("/api/user/account-settings");
  }

  updateAccountPreferences(payload: any) {
    return this.instance.put("/api/user/account-settings/account-preferences", {
      payload,
    });
  }

  updateSecuritySettings(payload: any) {
    return this.instance.put("/api/user/account-settings/security-settings", {
      payload,
    });
  }

  saveAllAccountPreferences(payload: any) {
    return this.instance.put("/api/user/account-settings", payload);
  }

  generateQr() {
    return this.instance.post("/api/auth/2fa/generate");
  }

  // 2FA setup verification (for initial setup)
  verify2FASetup(token: string) {
    return this.instance.post("/api/auth/2fa/setup-verify", {
      token,
    });
  }

  // 2FA verification without authentication (for login flow)
  verify2FA(token: string, email: string) {
    return this.publicInstance.post("/api/auth/2fa/login-verify", {
      token,
      email,
    });
  }

  getInvoices(
    page: number = 1,
    limit: number = 20,
    search: string = "",
    status: string = "",
    dateRange: string = ""
  ) {
    return this.instance.get("/api/invoices", {
      params: { page, limit, search, status, dateRange },
    });
  }

  getEmails(count: number = 20) {
    return this.instance.get("/api/mail/list", {
      params: { count },
    });
  }

  // Scan latest emails and cache them server-side
  scanAndCacheEmails(count: number = 10) {
    return this.instance.post("/api/mail/scan-cache", { count });
  }

  // Get cached emails
  getCachedEmails() {
    return this.instance.get("/api/mail/cache");
  }

  scanInvoices(retryCount: number = 0) {
    return this.instance.post(
      "/api/jobs/scan-invoices",
      {},
      {
        timeout: 600000, // 10 minutes timeout specifically for invoice scanning
        headers: {
          "X-Retry-Count": retryCount.toString(),
        },
      }
    );
  }

  // Download single invoice as PDF
  downloadInvoicePDF(invoiceId: string) {
    return this.instance.get(`/api/invoices/download/${invoiceId}`, {
      responseType: "blob",
    });
  }

  // Download all invoices as bulk PDF
  downloadAllInvoicesPDF() {
    return this.instance.get("/api/invoices/download-all", {
      responseType: "blob",
    });
  }

  // Mark invoice as paid
  markInvoiceAsPaid(invoiceId: string) {
    return this.instance.post(`/api/invoices/mark-paid/${invoiceId}`);
  }

  disable2FA() {
    return this.instance.post("/api/auth/2fa/disable");
  }

  // Send email verification
  sendEmailVerification(email: string) {
    return this.instance.post(
      "/api/user/account-settings/email-verification/send-otp",
      {
        email,
      }
    );
  }

  otpVerification(otp: string) {
    return this.instance.post(
      "/api/user/account-settings/email-verification/verify",
      {
        otp,
      }
    );
  }

  // Get recent syncs
  getRecentSyncs() {
    return this.instance.get("/api/syncs");
  }

  // Get latest sync
  getLatestSync() {
    return this.instance.get("/api/syncs/latest");
  }

  // Notification endpoints
  getNotifications(limit: number = 10, skip: number = 0) {
    return this.instance.get(`/api/notifications?limit=${limit}&skip=${skip}`);
  }

  getUnreadNotificationCount() {
    return this.instance.get("/api/notifications/unread-count");
  }

  markNotificationAsRead(notificationId: string) {
    return this.instance.patch(`/api/notifications/${notificationId}/read`);
  }

  markAllNotificationsAsRead() {
    return this.instance.patch("/api/notifications/mark-all-read");
  }

  // Download sync report as PDF
  downloadSyncPDF(syncId: string) {
    return this.instance.get(`/api/syncs/download/${syncId}`, {
      responseType: "blob",
    });
  }

  // Export personal data as PDF
  exportPersonalData() {
    return this.instance.get("/api/client-data/export-personal-data", {
      responseType: "blob",
    });
  }

  // Delete user account and all related data
  deleteUserAccount() {
    return this.instance.delete("/api/auth/delete-account");
  }

  // IMAP connection methods
  testImapConnection(credentials: {
    email: string;
    password: string;
    host: string;
    port: number;
    useTLS: boolean;
    username: string;
  }) {
    return this.instance.post("/api/imap/read-emails", credentials);
  }

  saveImapCredentials(credentials: {
    email: string;
    password: string;
    host: string;
    port: number;
    useTLS: boolean;
    username: string;
  }) {
    return this.instance.post("/api/imap/save-credentials", credentials);
  }

  microsoftAuth() {
    return this.instance.get("/api/microsoft");
  }

  createSubscription(planId: string) {
    return this.instance.post("/api/subscription", {
      planId: planId,
    });
  }

  createFreeSubscription() {
    return this.instance.post("/api/subscription/create-free-subscription");
  }

  getCurrentSubscription() {
    return this.instance.get("/api/subscription");
  }

  getPlans() {
    return this.instance.get("/api/plans/protected");
  }

  disconnectGmail(email: string) {
    return this.instance.post("/api/google/disconnect", { email });
  }
  disconnectMicrosoft(email: string) {
    return this.instance.post("/api/microsoft/disconnect", { email });
  }
  disconnectImap(email: string) {
    return this.instance.post("/api/imap/disconnect", { email });
  }

  getAccountantEmail() {
    return this.instance.get("/api/user/accountant-email");
  }

  getEmailBoxLimitReached() {
    return this.instance.get("/api/user/mailbox-limit-reached");
  }

  resendToAccountant(invoiceId: string) {
    return this.instance.post(`/api/invoices/resend/${invoiceId}`);
  }

  cancelSubscription(subscriptionId: string) {
    return this.instance.post("/api/subscription/cancel", {
      subscriptionId,
    });
  }

  getSentToAccountantCountAndErrorsDetected() {
    return this.instance.get(
      "/api/user/sent-to-accountant-count-and-errors-detected"
    );
  }

  // Admin API methods
  getAdminStats() {
    return this.instance.get("/api/admin/stats");
  }

  getAdminUserInsights(
    page: number = 1,
    limit: number = 20,
    search: string = ""
  ) {
    return this.instance.get("/api/admin/user-insights", {
      params: { page, limit, search },
    });
  }

  getAdminSystemHealth() {
    return this.instance.get("/api/admin/system-health");
  }

  getAdminSettings() {
    return this.instance.get("/api/admin/settings");
  }

  updateUserStatus(userId: string, isUserSuspended: boolean) {
    return this.instance.patch(`/api/admin/users/${userId}/status`, {
      isUserSuspended,
    });
  }

  changePaymentMethod() {
    return this.instance.put("/api/subscription/change-payment-method");
  }

  getAllTransactions(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    status: string = "",
    dateRange: string = ""
  ) {
    return this.instance.get("/api/transactions", {
      params: { page, limit, search, status, dateRange },
    });
  }

  // Download transaction PDF
  downloadTransactionPDF(url: string) {
    return this.instance.get(`/api/transactions/download`, {
      params: { url },
      responseType: "blob",
    });
  }

  sendContactForm(data: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    subject: string;
    message: string;
    inquiryType: string;
  }) {
    return this.publicInstance.post("/api/contact", data);
  }
}

const Api = new API();
export default Api;
