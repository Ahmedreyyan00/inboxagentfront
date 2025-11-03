export type LanguageCode = 'en' | 'fr' | 'nl';
export type LanguageName = 'English' | 'French' | 'Dutch';

export const languageMap: Record<LanguageCode, LanguageName> = {
  en: 'English',
  fr: 'French',
  nl: 'Dutch',
};

export const languageCodeMap: Record<LanguageName, LanguageCode> = {
  English: 'en',
  French: 'fr',
  Dutch: 'nl',
};

export const languageDisplayMap: Record<LanguageCode, string> = {
  en: '🇬🇧 English',
  fr: '🇫🇷 Français',
  nl: '🇳🇱 Nederlands',
};

export const languageNames: LanguageName[] = ['English', 'French', 'Dutch'];
export const languageCodes: LanguageCode[] = ['en', 'fr', 'nl'];

export const convertLanguageCodeToName = (code: LanguageCode): LanguageName => {
  return languageMap[code] || 'English';
};

export const convertLanguageNameToCode = (name: LanguageName): LanguageCode => {
  return languageCodeMap[name] || 'en';
};

export const isValidLanguageCode = (code: string): code is LanguageCode => {
  return languageCodes.includes(code as LanguageCode);
};

export const isValidLanguageName = (name: string): name is LanguageName => {
  return languageNames.includes(name as LanguageName);
};

export const getLanguageDisplayName = (code: LanguageCode): string => {
  return languageDisplayMap[code] || '🇬🇧 English';
}; 