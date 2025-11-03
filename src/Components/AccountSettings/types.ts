export type PersonalInfo = {
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  phone: string;
  organizationName: string;
};

export type Security = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  enable2FA: boolean;
  authenticationType: string;
};

export type ThirdPartyIntegration = {
  enableGoogleIntegration: boolean;
  enableOutlookIntegration: boolean;
  enableQuickbooksIntegration: boolean;
  enableXeroIntegration: boolean;
};

export type AccountPreferences = {
  timeZone: string;
  dateFormat: string;
  language: string;
};

export type ThirdPartyService = {
  name: string;
  icon: React.ReactElement;
  key: keyof ThirdPartyIntegration;
}; 