import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { setLanguage } from '@/redux/slice/languageSlice';
import { 
  isValidLanguageCode, 
  convertLanguageNameToCode, 
  LanguageCode 
} from '@/Utils/languageUtils';
import Api from '@/lib/Api';

export const useLanguageSync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentLanguage = useSelector(
    (state: RootState) => state.language.activeLanguage
  );

  useEffect(() => {
    const syncLanguageOnMount = async () => {
      try {
        // Get the current language from Redux/localStorage
        const reduxLanguage = isValidLanguageCode(currentLanguage) ? currentLanguage : 'en';
        
        // Fetch backend language preference
        const response = await Api.getAccountSettings();
        const backendLanguage = response.data?.accountSetting?.accountPreferences?.language;
        
        if (backendLanguage) {
          const backendLanguageCode = convertLanguageNameToCode(backendLanguage);
          
          // If backend language differs from Redux, prioritize Redux (user's current choice)
          if (backendLanguageCode !== reduxLanguage) {
            console.log('Language mismatch detected. Redux:', reduxLanguage, 'Backend:', backendLanguageCode);
            console.log('Keeping Redux language and updating backend to match');
            
            // Keep the Redux language and update backend to match
            // This will happen through the normal save process when user navigates
          }
        }
      } catch (error) {
        console.error('Failed to sync language on mount:', error);
      }
    };

    // Only run once on mount
    syncLanguageOnMount();
  }, []); // Empty dependency array - only run once

  return currentLanguage;
}; 