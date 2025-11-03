import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  activeLanguage: string;
}

const initialState: LanguageState = {
  activeLanguage: "en", 
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.activeLanguage = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
