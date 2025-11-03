"use client";

import { useState } from "react";
import {
  FaCircleQuestion,
  FaCircleXmark,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa6";
import Api from "../../lib/Api";
import { z } from "zod";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { OtherEmailModalTranslation } from "@/transalations/CommonTransaltion";

// Zod validation schemas
const emailSchema = z.string().email("Please enter a valid email address");
const hostSchema = z
  .string()
  .min(1, "Host is required")
  .regex(/^[a-zA-Z0-9.-]+$/, "Host contains invalid characters");
const portSchema = z.coerce
  .number()
  .int()
  .min(1, "Port must be at least 1")
  .max(65535, "Port must be at most 65535");
const passwordSchema = z.string().min(1, "Password is required");
const usernameSchema = z.string().optional();

// Combined form schema
const imapFormSchema = z.object({
  email: emailSchema,
  host: hostSchema,
  port: portSchema,
  password: passwordSchema,
  username: usernameSchema,
  useTLS: z.boolean().default(true),
});

type ImapFormData = z.infer<typeof imapFormSchema>;
type FormErrors = Partial<Record<keyof ImapFormData, string>> & {
  submit?: string;
};

interface OtherEmailModalProps {
  onClose: () => void;
  showEmailFailureModal: () => void;
  isConnected: boolean;
  emails: string[];
  mailBoxLimitReached: boolean;
}



export default function OtherEmailModal({
  showEmailFailureModal,
  onClose,
  isConnected,
  emails,
  mailBoxLimitReached,
}: OtherEmailModalProps) {
  const [formData, setFormData] = useState<ImapFormData>({
    email: "",
    host: "",
    port: 993,
    password: "",
    username: "",
    useTLS: true,
  });

  const language = useSelector((state: RootState) => state.language.activeLanguage);
  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const t = OtherEmailModalTranslation[currentLanguage as "en" | "fr" | "nl"];

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ImapFormData, boolean>>>({});
  const [showForm, setShowForm] = useState(false);

  // Validation function
  const validateField = (field: keyof ImapFormData, value: any): string => {
    try {
      const fieldSchema = (imapFormSchema as any).shape[field];
      fieldSchema.parse(value);
      return "";
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message || "Invalid value";
      }
      return "Invalid value";
    }
  };

  // Handle field changes with validation
  const handleFieldChange = (field: keyof ImapFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate field if it has been touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // Handle port change specifically
  const handlePortChange = (value: string) => {
    const portValue = value === "" ? "" : parseInt(value) || "";
    setFormData((prev) => ({ ...prev, port: portValue as any }));

    if (touched.port) {
      const error = validateField("port", portValue);
      setErrors((prev) => ({ ...prev, port: error }));
    }
  };

  // Handle field blur (mark as touched and validate)
  const handleFieldBlur = (field: keyof ImapFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Validate entire form
  const validateForm = (): boolean => {
    try {
      imapFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((err: z.ZodIssue) => {
          const field = err.path[0] as keyof ImapFormData;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleTestConnection = async () => {
    if (!validateForm()) {
      return;
    }

    setIsTestLoading(true);

    try {
      const response = await Api.testImapConnection({
        email: formData.email,
        password: formData.password,
        host: formData.host,
        port: formData.port,
        useTLS: formData.useTLS,
        username: formData.username || formData.email,
      });

      if (response.data.emails) {
        toast.success(t.connectionSuccessToast);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || t.connectionFailedCheckSettings;
      setErrors({ submit: errorMsg });
      toast.error(errorMsg);
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let response = await Api.saveImapCredentials({
        email: formData.email,
        password: formData.password,
        host: formData.host,
        port: formData.port,
        useTLS: formData.useTLS,
        username: formData.username || formData.email,
      });

      // Close modal on success
      onClose();
    } catch (err: any) {
      setErrors({
        submit: err.response?.data?.error || t.credentialsSaveFailed,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (email: string) => {
    try {
      const response = await Api.disconnectImap(email);
      toast.success(t.imapAccountDisconnectedSuccess.replace("{email}", email));
      onClose();
    } catch (error) {
      console.log({ error });
      toast.error(t.failedToDisconnectImap || "Failed to disconnect IMAP account");
    }
  };

  const handleAddNewAccount = () => {
    setShowForm(true);
    // Reset form data when adding new account
    setFormData({
      email: "",
      host: "",
      port: 993,
      password: "",
      username: "",
      useTLS: true,
    });
    setErrors({});
    setTouched({});
  };

  const handleBackToMain = () => {
    setShowForm(false);
  };

  // Show form if explicitly requested or if no emails are connected
  const shouldShowForm = showForm || (!isConnected && emails.length === 0);

  return (
    <div
      id="imap-auth-modal"
      className="fixed inset-0 bg-neutral-900/60 flex items-end sm:items-center justify-center z-50 w-full"
    >
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-2xl p-4 sm:p-8 relative max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-neutral-500 hover:text-neutral-800 transition"
          aria-label={t.closeModalAriaLabel}
        >
          <FaCircleXmark size={20} />
        </button>

        {shouldShowForm ? (
          // IMAP Form View
          <>
            {/* Back Button */}
            <button
              onClick={handleBackToMain}
              className="absolute top-4 left-4 cursor-pointer text-neutral-500 hover:text-neutral-800 transition flex items-center gap-2"
              aria-label={t.back}
            >
              <FaArrowLeft size={16} />
              <span className="text-sm">{t.back}</span>
            </button>

            <div id="imap-header-block" className="mb-6 text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">
                {t.addNewImapHeader}
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base mt-2">
                {t.addNewImapDescription}
              </p>
            </div>

            <form id="imap-form" className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Email and Server Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div id="imap-email-block" className="flex flex-col gap-1 flex-1">
                  <label htmlFor="imap-email" className="text-sm font-medium">
                    {t.emailAddressLabel}
                  </label>
                  <input
                    id="imap-email"
                    type="email"
                    autoComplete="username"
                    placeholder={t.emailPlaceholder}
                    required
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={() => handleFieldBlur("email")}
                    className={`border rounded-md px-3 py-2 text-neutral-800 bg-neutral-50 ${
                      errors.email ? "border-red-500" : "border-neutral-300"
                    }`}
                  />
                  {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>

                <div id="imap-server-block" className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <label htmlFor="imap-server" className="text-sm font-medium">
                      {t.imapServerLabel}
                    </label>
                    <div className="relative group">
                      <FaCircleQuestion className="text-neutral-500" />
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-60 bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 z-10 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                        {t.imapServerTooltip}
                      </div>
                    </div>
                  </div>
                  <input
                    id="imap-server"
                    type="text"
                    placeholder={t.imapServerPlaceholder}
                    required
                    value={formData.host}
                    onChange={(e) => handleFieldChange("host", e.target.value)}
                    onBlur={() => handleFieldBlur("host")}
                    className={`border rounded-md px-3 py-2 text-neutral-800 bg-neutral-50 ${
                      errors.host ? "border-red-500" : "border-neutral-300"
                    }`}
                  />
                  {errors.host && <span className="text-red-500 text-xs">{errors.host}</span>}
                </div>
              </div>

              {/* Port and Username Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div id="imap-port-block" className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <label htmlFor="imap-port" className="text-sm font-medium">
                      {t.portLabel}
                    </label>
                    <div className="relative group">
                      <FaCircleQuestion className="text-neutral-500" />
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 z-10 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                        {t.portTooltip}
                      </div>
                    </div>
                  </div>
                  <input
                    id="imap-port"
                    type="number"
                    min="1"
                    max="65535"
                    placeholder={t.portPlaceholder}
                    required
                    value={formData.port === 993 ? "993" : formData.port}
                    onChange={(e) => handlePortChange(e.target.value)}
                    onBlur={() => handleFieldBlur("port")}
                    className={`border rounded-md px-3 py-2 text-neutral-800 bg-neutral-50 ${
                      errors.port ? "border-red-500" : "border-neutral-300"
                    }`}
                  />
                  {errors.port && <span className="text-red-500 text-xs">{errors.port}</span>}
                </div>

                <div id="imap-username-block" className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <label htmlFor="imap-username" className="text-sm font-medium">
                      {t.usernameLabel} <span className="text-neutral-400 font-normal">{t.usernameOptional}</span>
                    </label>
                    <div className="relative group">
                      <FaCircleQuestion className="text-neutral-500" />
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-60 bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 z-10 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                        {t.usernameTooltip}
                      </div>
                    </div>
                  </div>
                  <input
                    id="imap-username"
                    type="text"
                    placeholder={t.usernamePlaceholder}
                    value={formData.username}
                    onChange={(e) => handleFieldChange("username", e.target.value)}
                    onBlur={() => handleFieldBlur("username")}
                    className={`border rounded-md px-3 py-2 text-neutral-800 bg-neutral-50 ${
                      errors.username ? "border-red-500" : "border-neutral-300"
                    }`}
                  />
                  {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
                </div>
              </div>

              {/* Password Row - Full Width */}
              <div id="imap-password-block" className="flex flex-col gap-1 relative">
                <label htmlFor="imap-password" className="text-sm font-medium">
                  {t.passwordLabel}
                </label>
                <div className="relative flex items-center">
                  <input
                    id="imap-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder={t.passwordPlaceholder}
                    required
                    value={formData.password}
                    onChange={(e) => handleFieldChange("password", e.target.value)}
                    onBlur={() => handleFieldBlur("password")}
                    className={`border rounded-md px-3 py-2 text-neutral-800 bg-neutral-50 w-full pr-10 ${
                      errors.password ? "border-red-500" : "border-neutral-300"
                    }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
              </div>

              {/* TLS Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="imap-tls"
                  type="checkbox"
                  checked={formData.useTLS}
                  onChange={(e) => handleFieldChange("useTLS", e.target.checked)}
                  className="rounded border-neutral-300"
                />
                <label htmlFor="imap-tls" className="text-sm font-medium">
                  {t.useTlsLabel}
                </label>
              </div>

              {errors.submit && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{errors.submit}</div>
              )}

              <div id="imap-action-buttons" className="flex flex-col gap-4 mt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-neutral-100 text-neutral-700 px-6 py-2.5 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  id="imap-test-btn"
                >
                  {isTestLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-700"></div>
                      <span>{t.testing}</span>
                    </>
                  ) : (
                    <span>{t.testConnectionButton}</span>
                  )}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center rounded-lg px-6 py-3 shadow text-white text-sm sm:text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#2c3e50" }}
                  id="imap-continue-btn"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t.saving}
                    </>
                  ) : (
                    t.continueButton
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          // Main View (Connected Emails List)
          <>
            <div id="imap-header-block" className="mb-6 text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">{t.imapConnectionStatus}</h2>
              <p className="text-neutral-600 text-sm sm:text-base mt-2">{t.manageConnectedAccounts}</p>
            </div>

            {/* Connected Emails List */}
            {emails.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">{t.connectedAccountsCount} ({emails.length})</h3>
                <div className="space-y-3">
                  {emails.map((email, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-neutral-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">I</span>
                        </div>
                        <span className="text-neutral-800 font-medium">{email}</span>
                      </div>
                      <button onClick={() => handleDisconnect(email)} className="w-full sm:w-auto px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors">{t.disconnect}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Connected Emails Message */}
            {emails.length === 0 && (
              <div className="mb-6 text-center">
                <p className="text-neutral-600 mb-4">{t.noImapAccountsConnected}</p>
              </div>
            )}

            {/* Add New Account Button */}
            <div className="flex flex-col gap-4">
              {!mailBoxLimitReached ? (
                <button onClick={handleAddNewAccount} className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 shadow text-white text-sm sm:text-base transition bg-blue-600 hover:bg-blue-700">
                  <FaPlus className="text-sm" />
                  {t.addNewImapAccount}
                </button>
              ) : (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <FaCircleQuestion className="text-white text-xs" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-orange-800">{t.mailboxLimitReached}</h4>
                      <p className="text-sm text-orange-700 mt-1">{t.mailboxLimitReachedMessage}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex items-center gap-3 justify-center mt-8">
          <FaLock className="text-neutral-400" />
          <span className="text-neutral-600 text-sm text-center">{t.secureCredentialsInfo}</span>
        </div>
      </div>
    </div>
  );
}
