import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Security } from "./types";
import Api from "@/lib/Api";
import TwoFactorSetupModal from "@/Components/Modals/TwoFactorSetupModal";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

interface SecuritySettingsProps {
  security: Security;
  onSecurityChange: (field: keyof Security, value: string | boolean) => void;
  onUpdatePassword: () => void;
  passwordUpdated: boolean;
  passwordError: boolean;
  isUpdatingPassword: boolean;
  onRefreshAccountSettings: () => void;
  t: any;
}

export default function SecuritySettings({
  security,
  onSecurityChange,
  onUpdatePassword,
  passwordUpdated,
  passwordError,
  isUpdatingPassword,
  onRefreshAccountSettings,
  t,
}: SecuritySettingsProps) {
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [is2faEnabled, setIs2faEnabled] = useState(security.enable2FA);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
console.log({userProfile})
  // Sync local state when parent security state changes
  useEffect(() => {
    setIs2faEnabled(security.enable2FA);
  }, [security.enable2FA]);

  // Fetch user profile to determine authentication method
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await Api.getProfile();
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Determine if user is a Google user (has googleId or no password)
  const isGoogleUser = userProfile?.data?.user?.hasPassword === false;

  useEffect(() => {
    console.log(isGoogleUser, "isGoogleUser")
  }, [isGoogleUser])

  const disabled2FA = async () => {
    try {
      const { status } = await Api.disable2FA();
      if (status === 200) {
        // Update account settings after disabling 2FA
        await Api.updateSecuritySettings({
          enable2FA: false,
          authenticationType: security.authenticationType,
        });
        // Refresh parent component's account settings
        onRefreshAccountSettings();
        toast.success("2FA disabled successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to disable 2FA");
    }
  };

  const handle2FASuccess = async () => {
    try {
      // Update account settings to reflect 2FA is now enabled
      await Api.updateSecuritySettings({
        enable2FA: true,
        authenticationType: "Authenticator App", // Force authenticator app since SMS is disabled
      });
      
      // Update parent component state
      onSecurityChange("enable2FA", true);
      onSecurityChange("authenticationType", "Authenticator App");
      
      // Refresh parent component's account settings
      onRefreshAccountSettings();
      
      toast.success("2FA enabled successfully!");
    } catch (error) {
      console.error("Error updating security settings:", error);
      toast.error("2FA was enabled but failed to update settings");
    }
  };

  const handleUpdatePassword = () => {
    // Check if new password and confirm password match
    if (security.newPassword !== security.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    
    // Check if new password is not empty
    if (!security.newPassword.trim()) {
      toast.error("New password cannot be empty");
      return;
    }
    
    // If validation passes, call the parent's update password function
    onUpdatePassword();
  };

  return (
    <section className="rounded-lg border-2 p-6 mb-6 shadow-sm" style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}>
      <h2 className="text-xl mb-4" style={{ color: 'var(--card-accent)' }}>{t.securitySettings}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div className="md:col-span-2 flex flex-col gap-4">
          {isGoogleUser && (
            <div className="mb-4 p-3 rounded-lg border-2" style={{ backgroundColor: 'var(--card-bg-medium)', borderColor: 'var(--card-border-light)' }}>
              <p className="text-sm" style={{ color: 'var(--card-accent)' }}>
                <strong>Google Account:</strong> You signed in with Google. Password changes are managed through your Google account.
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">{t.oldPassword}</label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                className={`w-full p-2 pr-10 border-2 rounded-lg ${
                  isGoogleUser ? 'bg-neutral-100 cursor-not-allowed' : ''
                }`}
                style={{ borderColor: 'var(--card-border-light)' }}
                placeholder={isGoogleUser ? "Managed by Google" : t.oldPassword}
                value={security.oldPassword}
                onChange={(e) => onSecurityChange("oldPassword", e.target.value)}
                disabled={isGoogleUser}
              />
              {!isGoogleUser && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">{t.newPassword}</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className={`w-full p-2 pr-10 border-2 rounded-lg ${
                  isGoogleUser ? 'bg-neutral-100 cursor-not-allowed' : ''
                }`}
                style={{ borderColor: 'var(--card-border-light)' }}
                placeholder={isGoogleUser ? "Managed by Google" : t.newPassword}
                value={security.newPassword}
                onChange={(e) => onSecurityChange("newPassword", e.target.value)}
                disabled={isGoogleUser}
              />
              {!isGoogleUser && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">{t.confirmPassword}</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full p-2 pr-10 border-2 rounded-lg ${
                  isGoogleUser ? 'bg-neutral-100 cursor-not-allowed' : ''
                }`}
                style={{ borderColor: 'var(--card-border-light)' }}
                placeholder={isGoogleUser ? "Managed by Google" : t.confirmPassword}
                value={security.confirmPassword}
                onChange={(e) =>
                  onSecurityChange("confirmPassword", e.target.value)
                }
                disabled={isGoogleUser}
              />
              {!isGoogleUser && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              className={`px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:shadow-sm ${
                isGoogleUser 
                  ? 'cursor-not-allowed' 
                  : ''
              }`}
              style={{
                backgroundColor: isGoogleUser ? '#e5e7eb' : 'var(--card-accent)',
                color: isGoogleUser ? '#6b7280' : 'white',
                borderColor: 'var(--card-accent)'
              }}
              onClick={handleUpdatePassword}
              disabled={isGoogleUser || isUpdatingPassword}
            >
              {isUpdatingPassword ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Updating...
                </>
              ) : (
                t.updatePassword
              )}
            </button>
          </div>
          <div className="flex items-center mt-2 gap-3">
            {passwordUpdated && (
              <span className="text-sm flex items-center" style={{ color: 'var(--card-accent)' }}>
                <FaCheckCircle className="mr-2" style={{ color: 'var(--card-accent)' }} />
                Password updated successfully.
              </span>
            )}
            {passwordError && (
              <span className="text-sm flex items-center" style={{ color: 'var(--card-accent)' }}>
                <FaCircleXmark className="mr-2" style={{ color: 'var(--card-accent)' }} />
                Error: Passwords do not match.
              </span>
            )}
          </div>
        </div>
        {!isGoogleUser && <div>
          <div className="flex items-center justify-between mb-2">
            <span>Enable 2FA</span>
            <label className={security.authenticationType === "SMS" ? "cursor-not-allowed" : "cursor-pointer"}>
              <input
                type="checkbox"
                className="sr-only"
                checked={security.enable2FA}
                disabled={security.authenticationType === "SMS"}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  onSecurityChange("enable2FA", isChecked);
                  
                  if (isChecked) {
                    // User wants to enable 2FA - show modal
                    setShow2FAModal(true);
                  } else {
                    // User wants to disable 2FA
                    setShow2FAModal(false);
                    // Only call disable2FA when user actively unchecked it and it was previously enabled
                    if (is2faEnabled) {
                      disabled2FA();
                    }
                  }
                  setIs2faEnabled(isChecked);
                }}
              />
              <div
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  security.authenticationType === "SMS" 
                    ? "bg-neutral-200 cursor-not-allowed" 
                    : security.enable2FA 
                    ? "bg-[var(--brand-color)]" 
                    : "bg-neutral-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    security.enable2FA ? "right-0.5" : "left-0.5"
                  }`}
                />
              </div>
            </label>
          </div>
          {security.authenticationType === "SMS" && (
            <p className="text-xs text-neutral-500 mb-2">
              2FA is not available for SMS at the moment. Please select Authenticator App.
            </p>
          )}
          <div className="ml-1 mt-2 space-y-2">
          <div className="flex items-center gap-2">
              <input
                type="radio"
                name="2fa-method"
                className="accent-[var(--brand-color)]"
                checked={security.authenticationType === "Authenticator App"}
                onChange={() =>
                  onSecurityChange("authenticationType", "Authenticator App")
                }
              />
              <span>Authenticator App</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <input
                type="radio"
                name="2fa-method"
                className="accent-neutral-800"
                checked={security.authenticationType === "SMS"}
                onChange={() => onSecurityChange("authenticationType", "SMS")}
                disabled={true}
              />
              <span className={security.authenticationType === "SMS" ? "text-neutral-400" : "text-neutral-700"}>
                SMS (Coming Soon)
              </span>
            </div> */}
            
            <div className="w-full h-20 rounded-md flex items-center justify-center mt-3 border-2" style={{ backgroundColor: 'var(--card-bg-medium)', borderColor: 'var(--card-border-light)' }}>
              <span className="text-sm" style={{ color: 'var(--card-accent)' }}>[2FA Setup/QR Visual]</span>
            </div>
          </div>
        </div>}
      </div>
      {show2FAModal && (
        <TwoFactorSetupModal
          onClose={() => {
            setShow2FAModal(false);
            // If modal is closed without successful setup, reset the toggle
            if (!security.enable2FA) {
              onSecurityChange("enable2FA", false);
              setIs2faEnabled(false);
            }
          }}
          onSuccess={handle2FASuccess}
        />
      )}
    </section>
  );
}
