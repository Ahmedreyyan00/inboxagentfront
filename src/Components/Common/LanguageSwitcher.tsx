"use client";

import { useState } from "react";
import { FaGlobe, FaChevronDown } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { setLanguage } from "@/redux/slice/languageSlice";
import { 
  LanguageCode, 
  languageCodes, 
  getLanguageDisplayName, 
  isValidLanguageCode,
  convertLanguageCodeToName 
} from "@/Utils/languageUtils";
import Api from "@/lib/Api";
import toast from "react-hot-toast";

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

export default function LanguageSwitcher({ 
  className = "", 
  showLabel = true 
}: LanguageSwitcherProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );

  const currentLanguage = isValidLanguageCode(language) ? language : 'fr';

  const changeLanguage = async (lang: LanguageCode) => {
    // Update Redux store immediately
    dispatch(setLanguage(lang));
    setShowDropdown(false);
    
    // Auto-save to backend
    try {
      const languageName = convertLanguageCodeToName(lang);
      
      // Get current account settings first to preserve other preferences
      const response = await Api.getAccountSettings();
      const currentPrefs = response.data?.accountSetting?.accountPreferences || {};
      
      // Update only the language field
      const updatedPrefs = {
        timeZone: currentPrefs.timeZone || "UTC",
        dateFormat: currentPrefs.dateFormat || "MM/DD/YYYY",
        language: languageName,
      };
      
      await Api.updateAccountPreferences(updatedPrefs);
      console.log('Language preference auto-saved to backend');
    } catch (error) {
      console.error('Failed to auto-save language preference:', error);
      // Don't show error toast for header language changes to avoid interrupting UX
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        className="cursor-pointer inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
        onClick={toggleDropdown}
      >
        <FaGlobe />
        {showLabel && currentLanguage.toUpperCase()}
        <FaChevronDown className="text-xs" />
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-36 rounded-md border border-neutral-300 bg-white shadow-lg z-20">
            {languageCodes.map((lang) => (
              <button
                key={lang}
                className="cursor-pointer block w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 transition-colors"
                onClick={() => changeLanguage(lang)}
              >
                {getLanguageDisplayName(lang)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 