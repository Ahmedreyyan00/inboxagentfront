"use client";

import { RootState } from "@/redux/store";
import { AutomationSettingsTranslations } from "@/transalations/CommonTransaltion";
import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import InvoiceUsage from "../InvoiceHistory/InvoiceUsage";
import Api from "@/lib/Api";
import { AutomationSettingsSkeleton } from "../skeletons/TableSkeletons";
import { TbLoader2 } from "react-icons/tb";

const AutomationSettings = () => {
  const [frequency, setFrequency] = useState("weekly");
  const [customFrequencyDays, setCustomFrequencyDays] = useState("");
  const [customFrequencyError, setCustomFrequencyError] = useState("");
  const [forwardingMethod, setForwardingMethod] = useState("Email");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [autoForwarding, setAutoForwarding] = useState(true);
  const [notifications, setNotifications] = useState({
    success: true,
    failed: true,
    forwardingError: true,
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [maxEmailsPerScan, setMaxEmailsPerScan] = useState(10);
  
  // Store original values for cancel functionality
  const [originalSettings, setOriginalSettings] = useState({
    frequency: "weekly",
    customFrequencyDays: "",
    forwardingMethod: "Email",
    recipientEmail: "",
    autoForwarding: true,
    maxEmailsPerScan: 10,
    notifications: {
      success: true,
      failed: true,
      forwardingError: true,
    },
  });
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );

  useEffect(() => {
    getAutomationSettings();
  }, []);

  const t = AutomationSettingsTranslations[language as "en" | "fr" | "nl"];

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const validateCustomDays = (value: string) => {
    if (!value.trim()) {
      setCustomFrequencyError(t.invalidNumber);
      return false;
    }
    const num = parseInt(value, 10);
    if (isNaN(num) || num <= 0) {
      setCustomFrequencyError(t.invalidNumber);
      return false;
    }
    setCustomFrequencyError("");
    return true;
  };

  const handleCustomDaysChange = (value: string) => {
    setCustomFrequencyDays(value);
    if (frequency === "custom") {
      validateCustomDays(value);
    }
  };

  const handleFrequencyChange = (newFrequency: string) => {
    setFrequency(newFrequency);
    if (newFrequency !== "custom") {
      setCustomFrequencyError("");
    } else if (customFrequencyDays) {
      validateCustomDays(customFrequencyDays);
    }
  };

  const renderToggle = (enabled: boolean, onClick: () => void) => (
    <div
      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${
        enabled ? "" : "bg-neutral-300"
      }`}
      style={{ backgroundColor: enabled ? 'var(--card-accent)' : undefined }}
      onClick={onClick}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
          enabled ? "right-0.5" : "left-0.5"
        }`}
      />
    </div>
  );

  const getAutomationSettings = async () => {
    try {
      setInitialLoading(true);
      const { data } = await Api.getAutomationSettings();

      const settings = {
        frequency: data.automationSettings.emailScanFrequency || "weekly",
        customFrequencyDays: data.automationSettings.customEmailScanFrequency || "",
        forwardingMethod: data.automationSettings.invoiceForwarding?.forwardingMethod || "Email",
        recipientEmail: data.automationSettings.invoiceForwarding?.recipientEmail || "",
        autoForwarding: data.automationSettings.invoiceForwarding?.enableAutomaticForwarding ?? true,
        maxEmailsPerScan: data.automationSettings.maxEmailsPerScan ?? 10,
        notifications: {
          success: data.automationSettings.notifications?.successfulInvoiceExtraction ?? true,
          failed: data.automationSettings.notifications?.failedInvoiceExtraction ?? false,
          forwardingError: data.automationSettings.notifications?.forwardingErrors ?? false,
        },
      };

      // Store original values for cancel functionality
      setOriginalSettings(settings);

      // Set current values
      setFrequency(settings.frequency);
      setCustomFrequencyDays(settings.customFrequencyDays);
      setForwardingMethod(settings.forwardingMethod);
      setRecipientEmail(settings.recipientEmail);
      setAutoForwarding(settings.autoForwarding);
      setMaxEmailsPerScan(settings.maxEmailsPerScan);
      setNotifications(settings.notifications);
      
      console.log({data})
    } catch (error) {
      console.log(error);
    } finally {
      setInitialLoading(false);
    }
  };

  const cancelChanges = () => {
    // Reset all values to original settings
    setFrequency(originalSettings.frequency);
    setCustomFrequencyDays(originalSettings.customFrequencyDays);
    setForwardingMethod(originalSettings.forwardingMethod);
    setRecipientEmail(originalSettings.recipientEmail);
    setAutoForwarding(originalSettings.autoForwarding);
    setMaxEmailsPerScan(originalSettings.maxEmailsPerScan);
    setNotifications(originalSettings.notifications);
    setCustomFrequencyError("");
  };

  const saveAutomationSetting = async () => {
    try {
      setLoading(true);
      
      // Validate custom frequency if selected
      if (frequency === "custom" && !validateCustomDays(customFrequencyDays)) {
        setLoading(false);
        return;
      }

      const payload = {
        emailScanFrequency: frequency,
        customEmailScanFrequency: frequency === "custom" ? customFrequencyDays : "",
        invoiceForwarding: {
          enableAutomaticForwarding: autoForwarding,
          recipientEmail,
          forwardingMethod,
        },
        maxEmailsPerScan,
        notifications: {
          successfulInvoiceExtraction: notifications.success,
          failedInvoiceExtraction: notifications.failed,
          forwardingErrors: notifications.forwardingError,
        },
      };

      const response = await Api.saveAutomationSetting(payload);
      await getAutomationSettings()
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <AutomationSettingsSkeleton />;
  }

  return (
    <main id="main-content" className="flex-1 w-full px-4 py-6 sm:p-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div id="page-header" className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl mb-2" style={{ color: 'var(--card-accent)' }}>{t.automationSettings}</h1>
        <p className="text-neutral-600 text-sm sm:text-base">{t.configureSmartle}</p>
      </div>

      {/* Scan Frequency */}
      <div
        id="scan-frequency"
        className="rounded-lg border-2 p-4 sm:p-6 mb-6"
        style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}
      >
        <h2 className="text-lg sm:text-xl mb-3 sm:mb-4" style={{ color: 'var(--card-accent)' }}>{t.emailScanFrequency}</h2>
        <p className="text-neutral-600 text-sm sm:text-base mb-4 sm:mb-6">{t.scanInboxSmartle}</p>

        <div className="space-y-4">
          {[
            { label: `${t.Daily}`, value: "daily" },
            { label: `${t.Every} 3 ${t.Days}`, value: "every 3 days" },
            { label: `${t.Weekly}`, value: "weekly" },
          ].map((option) => (
            <div key={option.value} className="space-y-3">
              <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors hover:shadow-sm"
                style={{ borderColor: 'var(--card-border-light)' }}
              >
                <input
                  type="radio"
                  name="frequency"
                  className="w-4 h-4"
                  style={{ accentColor: 'var(--card-accent)' }}
                  checked={frequency === option.value}
                  onChange={() => handleFrequencyChange(option.value)}
                />
                <span className="text-sm sm:text-base" style={{ color: 'var(--card-accent)' }}>{option.label}</span>
              </label>
              
              {/* Custom frequency input */}
              {option.value === "custom" && frequency === "custom" && (
                <div className="ml-7 p-3 sm:p-4 rounded-lg border-2" style={{ backgroundColor: 'var(--card-bg-medium)', borderColor: 'var(--card-border-light)' }}>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--card-accent)' }}>
                    {t.customDays}
                  </label>
                  <input
                    type="text"
                    value={customFrequencyDays}
                    onChange={(e) => handleCustomDaysChange(e.target.value)}
                    placeholder={t.enterNumberOfDays}
                    className={`w-full p-2 border-2 rounded-lg focus:ring-2 focus:outline-none ${
                      customFrequencyError 
                        ? "border-red-500 focus:ring-red-500" 
                        : ""
                    }`}
                    style={{
                      borderColor: customFrequencyError ? '#ef4444' : 'var(--card-border-light)'
                    }}
                  />
                  {customFrequencyError && (
                    <p className="mt-1 text-sm text-red-500">{customFrequencyError}</p>
                  )}
                  <p className="mt-2 text-xs text-neutral-500">{t.customDaysHelp}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Forwarding Settings */}
      <div
        id="forwarding-settings"
        className="rounded-lg border-2 p-4 sm:p-6 mb-6"
        style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}
      >
        <h2 className="text-lg sm:text-xl mb-3 sm:mb-4" style={{ color: 'var(--card-accent)' }}>{t.invoiceForwarding}</h2>
        <p className="text-neutral-600 text-sm sm:text-base mb-4 sm:mb-6">{t.chooseInvoiceForwarding}</p>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm sm:text-base">{t.forwardingMethod}</label>
            <div className="relative">
              <select
                className="w-full p-2 border-2 rounded-lg appearance-none text-sm sm:text-base"
                style={{ borderColor: 'var(--card-border-light)' }}
                value={forwardingMethod}
                onChange={(e) => setForwardingMethod(e.target.value)}
              >
                <option>{t.Email}</option>
                <option>QuickBooks {t.Integration}</option>
                <option>Xero {t.Integration}</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--card-accent)' }} />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm sm:text-base">{t.RecipientEmail}</label>
            <input
              type="email"
              className={`w-full p-2 border-2 rounded-lg text-sm sm:text-base`}
              style={{ borderColor: !recipientEmail ? '#ef4444' : 'var(--card-border-light)' }}
              placeholder="accountant@company.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 border-2 rounded-lg" style={{ borderColor: 'var(--card-border-light)' }}>
            <span className="text-sm sm:text-base" style={{ color: 'var(--card-accent)' }}>{t.EnableAutomaticForwarding}</span>
            {renderToggle(autoForwarding, () =>
              setAutoForwarding(!autoForwarding)
            )}
          </div>
        </div>
      </div>

   
      <div
        id="notification-settings"
        className="rounded-lg border-2 p-4 sm:p-6 mb-24 sm:mb-6"
        style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}
      >
        <h2 className="text-lg sm:text-xl mb-3 sm:mb-4" style={{ color: 'var(--card-accent)' }}>{t.Notifications}</h2>
        <p className="text-neutral-600 text-sm sm:text-base mb-4 sm:mb-6">{t.manageUpdates}</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border-2 rounded-lg" style={{ borderColor: 'var(--card-border-light)' }}>
            <span className="text-sm sm:text-base" style={{ color: 'var(--card-accent)' }}>{t.successfulInvoiceExtraction}</span>
            {renderToggle(notifications.success, () => handleToggle("success"))}
          </div>
          <div className="flex items-center justify-between p-3 border-2 rounded-lg" style={{ borderColor: 'var(--card-border-light)' }}>
            <span className="text-sm sm:text-base" style={{ color: 'var(--card-accent)' }}>{t.failedScans}</span>
            {renderToggle(notifications.failed, () => handleToggle("failed"))}
          </div>
          <div className="flex items-center justify-between p-3 border-2 rounded-lg" style={{ borderColor: 'var(--card-border-light)' }}>
            <span className="text-sm sm:text-base" style={{ color: 'var(--card-accent)' }}>{t.forwardingErrors}</span>
            {renderToggle(notifications.forwardingError, () =>
              handleToggle("forwardingError")
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        id="action-buttons"
        className="sticky bg-blue-grad bottom-0 border-t-2 p-3 sm:p-4 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4"
      >
        <button
          onClick={cancelChanges}
          disabled={loading}
          className="px-4 py-2 border-2 rounded-lg flex items-center gap-2 transition-colors hover:shadow-sm w-full sm:w-auto"
          style={{ 
            borderColor: 'var(--card-border-light)',
            color: 'var(--card-accent)',
            backgroundColor: 'white'
          }}
        >
          {t.Cancel}
        </button>
        <button
          onClick={saveAutomationSetting}
          disabled={loading}
          className="px-4 py-2 rounded-lg transition-colors hover:shadow-sm w-full sm:w-auto"
          style={{ 
            backgroundColor: 'var(--card-accent)',
            borderColor: 'var(--card-accent)',
            color: 'white'
          }}
        >
          {loading ? (
            <TbLoader2 className="w-4 h-4 animate-spin" />
          ) : (
            t.SaveChanges
          )}
        </button>
      </div>
    </main>
  );
};

export default AutomationSettings;
