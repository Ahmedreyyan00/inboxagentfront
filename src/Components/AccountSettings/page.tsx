"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { AccountSettingsTransalation } from "@/transalations/CommonTransaltion";
import {
  convertLanguageCodeToName,
  isValidLanguageCode,
} from "@/Utils/languageUtils";

// Import components
import PersonalDetails from "./PersonalDetails";
import SecuritySettings from "./SecuritySettings";
import AccountPreferences from "./AccountPreferences";
import AccountControl from "./AccountControl";

// Import types
import {
  PersonalInfo,
  Security,
  ThirdPartyIntegration,
  AccountPreferences as AccountPreferencesType,
} from "./types";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import { AccountSettingsSkeleton } from "../ui/skeleton-loaders";

export default function AccountSettings() {
  const [showInfoConfirmation, setShowInfoConfirmation] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingPersonalInfo, setIsUpdatingPersonalInfo] = useState(false);
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    email: "",
    isEmailVerified: false,
    phone: "",
    organizationName: "",
  });

  // Security State
  const [security, setSecurity] = useState<Security>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    enable2FA: false,
    authenticationType: "Authenticator App",
  });

  // Third Party Integration State
  const [thirdPartyIntegration, setThirdPartyIntegration] =
    useState<ThirdPartyIntegration>({
      enableGoogleIntegration: false,
      enableOutlookIntegration: false,
      enableQuickbooksIntegration: false,
      enableXeroIntegration: false,
    });

  // Account Preferences State
  const [accountPreferences, setAccountPreferences] =
    useState<AccountPreferencesType>({
      timeZone: "UTC",
      dateFormat: "MM/DD/YYYY",
      language: convertLanguageCodeToName(
        isValidLanguageCode(language) ? language : "en"
      ),
    });
  // Fetch account settings on component mount
  const fetchAccountSettings = async () => {
    try {
      setIsLoading(true);
      const response = await Api.getAccountSettings();
      const { accountSetting } = response.data;

      if (accountSetting) {
        // Update personal info
        if (accountSetting.personalInfo) {
          setPersonalInfo((prev) => ({
            ...prev,
            fullName: accountSetting.personalInfo.fullName || "",
            email: accountSetting.personalInfo.email || "",
            isEmailVerified:
              accountSetting.emailVerification?.status === "verified"
                ? true
                : false,
            phone: accountSetting.personalInfo.phone || "",
            organizationName:
              accountSetting.personalInfo.organizationName || "",
          }));
        }

        // Update security settings
        if (accountSetting.security) {
          setSecurity((prev) => ({
            ...prev,
            enable2FA: accountSetting.security.enable2FA || false,
            authenticationType:
              accountSetting.security.authenticationType || "Authenticator App",
          }));
        }

        // Update third party integrations
        if (accountSetting.thirdPartyIntegration) {
          setThirdPartyIntegration((prev) => ({
            ...prev,
            enableGoogleIntegration:
              accountSetting.thirdPartyIntegration.enableGoogleIntegration ||
              false,
            enableOutlookIntegration:
              accountSetting.thirdPartyIntegration.enableOutlookIntegration ||
              false,
            enableQuickbooksIntegration:
              accountSetting.thirdPartyIntegration
                .enableQuickbooksIntegration || false,
            enableXeroIntegration:
              accountSetting.thirdPartyIntegration.enableXeroIntegration ||
              false,
          }));
        }

        // Update account preferences - only sync from backend on initial load
        if (accountSetting.accountPreferences) {
          const backendLanguage = accountSetting.accountPreferences.language;
          const currentLanguageName = convertLanguageCodeToName(
            isValidLanguageCode(language) ? language : "en"
          );

          setAccountPreferences((prev) => ({
            ...prev,
            timeZone: accountSetting.accountPreferences.timeZone || "UTC",
            dateFormat:
              accountSetting.accountPreferences.dateFormat || "MM/DD/YYYY",
            language: currentLanguageName, // Use current Redux language, not backend
          }));

          // Only sync from backend if there's a mismatch and this is the initial load
          if (backendLanguage && backendLanguage !== currentLanguageName) {
            console.log(
              "Language mismatch detected, backend:",
              backendLanguage,
              "current:",
              currentLanguageName
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching account settings:", error);
      toast.error("Failed to load account settings");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAccountSettings();
  }, []); // Remove language from dependency array to prevent refetch on language change

  const refreshAccountSettings = async () => {
    try {
      const response = await Api.getAccountSettings();
      const { accountSetting } = response.data;

      if (accountSetting) {
        // Update security settings specifically
        if (accountSetting.security) {
          setSecurity((prev) => ({
            ...prev,
            enable2FA: accountSetting.security.enable2FA || false,
            authenticationType:
              accountSetting.security.authenticationType || "Authenticator App",
          }));
        }
      }
    } catch (error) {
      console.error("Error refreshing account settings:", error);
    }
  };

  // Personal Info Handlers
  const handlePersonalInfoChange = (
    field: keyof PersonalInfo,
    value: string
  ) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Security Handlers
  const handleSecurityChange = (
    field: keyof Security,
    value: string | boolean
  ) => {
    setSecurity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Account Preferences Handlers
  const handleAccountPreferencesChange = (
    field: keyof AccountPreferencesType,
    value: string
  ) => {
    setAccountPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSavePreference = async () => {
    try {
      setIsUpdatingPreferences(true);
      const { status } = await Api.updateAccountPreferences(accountPreferences);
      toast.success("Account preferences updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update account preferences");
    } finally {
      setIsUpdatingPreferences(false);
    }
  };

  const handleUpdatePersonalInfo = async () => {
    try {
      setIsUpdatingPersonalInfo(true);
      const response = await Api.updatePersonalInfo({
        fullName: personalInfo.fullName,
        email: personalInfo.email,
        isEmailVerified: personalInfo.isEmailVerified,
        phone: personalInfo.phone,
        organizationName: personalInfo.organizationName,
      });
      console.log("response", response);
      toast.success("Personal details updated successfully");
    } catch (error) {
      console.error("Error updating personal info:", error);
      toast.error("Failed to update personal details");
    } finally {
      setIsUpdatingPersonalInfo(false);
      setShowInfoConfirmation(true);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setIsUpdatingPassword(true);
      // Check if user is a Google user first (prevent unnecessary API call)
      const profileResponse = await Api.getProfile();
      const userProfile = profileResponse.data.user;
      const isGoogleUser = userProfile?.data?.user?.hasPassword === false;

      if (isGoogleUser) {
        toast.error(
          "Password changes are managed through your Google account."
        );
        return;
      }

      if (security.newPassword === security.confirmPassword) {
        // Here you would typically make an API call to update password
        console.log("Updating password");
        setPasswordUpdated(true);
        setPasswordError(false);

        const { status } = await Api.updatePassword({
          oldPassword: security.oldPassword,
          newPassword: security.newPassword,
        });
        console.log({ status });
        if (status === 201) {
          toast.success("password updated successfully");
        }
        setSecurity((prev) => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        setPasswordError(true);
        setPasswordUpdated(false);
      }
    } catch (error: any) {
      console.log(error);
      // Handle specific Google user error from backend
      if (error.response?.data?.message?.includes("Google")) {
        toast.error(
          "Password changes are managed through your Google account."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to update password"
        );
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSaveAllChanges = async () => {
    try {
      setIsSavingAll(true);
      const allSettings = {
        personalInfo: {
          fullName: personalInfo.fullName,
          email: personalInfo.email,
          isEmailVerified: personalInfo.isEmailVerified,
          phone: personalInfo.phone,
          organizationName: personalInfo.organizationName,
        },
        security: {
          enable2FA: security.enable2FA,
          authenticationType: security.authenticationType,
        },
        thirdPartyIntegration,
        accountPreferences: {
          timeZone: accountPreferences.timeZone,
          dateFormat: accountPreferences.dateFormat,
          language: accountPreferences.language,
        },
      };

      const response = await Api.saveAllAccountPreferences(allSettings);
      console.log("All settings saved:", response);
      setShowSaveConfirmation(true);
      toast.success("Account settings updated successfully");
    } catch (error) {
      console.error("Error saving all settings:", error);
      toast.error("Failed to update account settings");
    } finally {
      setIsSavingAll(false);
    }
  };

  const t = AccountSettingsTransalation[language as "en" | "fr" | "nl"];

  if (isLoading) {
    return <AccountSettingsSkeleton />;
  }

  return (
    <main className="flex flex-col p-4 sm:p-10 w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl mb-2" style={{ color: "var(--card-accent)" }}>
          {t.accountSettings}
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base">{t.subHeading}</p>
      </div>

      {/* Personal Details */}
      <PersonalDetails
        personalInfo={personalInfo}
        onPersonalInfoChange={handlePersonalInfoChange}
        onUpdatePersonalInfo={handleUpdatePersonalInfo}
        showInfoConfirmation={showInfoConfirmation}
        isUpdating={isUpdatingPersonalInfo}
        fetchAccountSettings={fetchAccountSettings}
        t={t}
      />

      {/* Security Settings */}
      <SecuritySettings
        security={security}
        onSecurityChange={handleSecurityChange}
        onUpdatePassword={handleUpdatePassword}
        passwordUpdated={passwordUpdated}
        passwordError={passwordError}
        isUpdatingPassword={isUpdatingPassword}
        onRefreshAccountSettings={refreshAccountSettings}
        t={t}
      />

      {/* Account Preferences */}
      <AccountPreferences
        accountPreferences={accountPreferences}
        onAccountPreferencesChange={handleAccountPreferencesChange}
        onSavePreference={handleSavePreference}
        isUpdating={isUpdatingPreferences}
        t={t}
      />

      {/* Account Control */}
      <AccountControl t={t} />

      {/* Sticky Bottom Buttons */}
      <div className="sticky bottom-0 p-3 sm:p-4 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 z-20 border-t-2 bg-blue-grad">
        <button
          className="px-4 py-2 border-2 rounded-lg transition-all hover:shadow-sm"
          style={{
            borderColor: "var(--card-border-light)",
            color: "var(--card-accent)",
            backgroundColor: "white",
          }}
        >
          {t.Cancel}
        </button>
        <button
          className="px-4 py-2 rounded-lg flex items-center justify-center gap-2 border-2 transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveAllChanges}
          disabled={isSavingAll}
          style={{
            backgroundColor: "var(--card-accent)",
            borderColor: "var(--card-accent)",
            color: "white",
          }}
        >
          {isSavingAll ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            t.saveAllChanges
          )}
        </button>
        {showSaveConfirmation && (
          <div
            className="flex items-center sm:ml-6 text-sm"
            style={{ color: "var(--card-accent)" }}
          >
            <FaCircleCheck
              className="mr-2"
              style={{ color: "var(--card-accent)" }}
            />
            Your account settings have been updated successfully.
          </div>
        )}
      </div>
    </main>
  );
}
