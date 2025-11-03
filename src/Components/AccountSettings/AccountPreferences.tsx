import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { AccountPreferences as AccountPreferencesType } from "./types";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { setLanguage } from "@/redux/slice/languageSlice";
import { 
  LanguageCode, 
  LanguageName, 
  languageNames, 
  convertLanguageCodeToName, 
  convertLanguageNameToCode, 
  isValidLanguageCode 
} from "@/Utils/languageUtils";
import Api from "@/lib/Api";
import toast from "react-hot-toast";

interface AccountPreferencesProps {
  accountPreferences: AccountPreferencesType;
  onAccountPreferencesChange: (field: keyof AccountPreferencesType, value: string) => void;
  onSavePreference: () => void;
  isUpdating: boolean;
  t: any;
}

export default function AccountPreferences({
  accountPreferences,
   onAccountPreferencesChange,
  onSavePreference,
  isUpdating,
  t,
}: AccountPreferencesProps) {
  const dispatch = useDispatch<AppDispatch>();
  const currentLanguage = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  
  // Handle language change in account settings
  const handleLanguageChange = async (languageName: LanguageName) => {
    const languageCode = convertLanguageNameToCode(languageName);
    
    // Update Redux store immediately
    dispatch(setLanguage(languageCode));
    
    // Update local state
    onAccountPreferencesChange('language', languageName);
    
    // Auto-save to backend immediately
    try {
      const updatedPreferences = {
        ...accountPreferences,
        language: languageName,
      };
      
      await Api.updateAccountPreferences(updatedPreferences);
      console.log('Language preference saved to backend');
      toast.success('Language preference saved successfully');
    } catch (error) {
      console.error('Failed to save language preference:', error);
      toast.error('Failed to save language preference');
    }
  };
  return (
    <section
      id="account-preferences"
      className="rounded-lg border-2 p-6 mb-6 shadow-sm"
      style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}
    >
      <h2 className="text-xl mb-4" style={{ color: 'var(--card-accent)' }}>{t.accountPrefernces}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm mb-1">{t.timeZone}</label>
          <select 
            className="w-full p-2 border-2 rounded-lg"
            style={{ borderColor: 'var(--card-border-light)' }}
            value={accountPreferences.timeZone}
            onChange={(e) => onAccountPreferencesChange('timeZone', e.target.value)}
          >
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="GMT">GMT (Greenwich Mean Time)</option>
            <option value="EST">EST (Eastern Time)</option>
            <option value="PST">PST (Pacific Time)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">{t.dateFormat}</label>
          <div className="flex flex-col gap-1 mt-1">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="date-format"
                className="accent-[var(--brand-color)]"
                checked={accountPreferences.dateFormat === "MM/DD/YYYY"}
                onChange={() => onAccountPreferencesChange('dateFormat', 'MM/DD/YYYY')}
              />
              <span>MM/DD/YYYY</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="date-format"
                className="accent-[var(--brand-color)]"
                checked={accountPreferences.dateFormat === "DD/MM/YYYY"}
                onChange={() => onAccountPreferencesChange('dateFormat', 'DD/MM/YYYY')}
              />
              <span>DD/MM/YYYY</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">{t.language}</label>
            <select
            onChange={(e) => handleLanguageChange(e.target.value as LanguageName)}
            value={accountPreferences.language}
            className="w-full p-2 border-2 rounded-lg"
            style={{ borderColor: 'var(--card-border-light)' }}
          >
            {languageNames.map((langName) => (
              <option key={langName} value={langName}>
                {langName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={onSavePreference}
          disabled={isUpdating}
          className="px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:shadow-sm"
          style={{ 
            backgroundColor: 'var(--card-accent)',
            borderColor: 'var(--card-accent)',
            color: 'white'
          }}
        >
          {isUpdating ? (
            <>
              <FaSpinner className="animate-spin" />
              Saving...
            </>
          ) : (
            t.savePreference
          )}
        </button>
      </div>
    </section>
  );
} 