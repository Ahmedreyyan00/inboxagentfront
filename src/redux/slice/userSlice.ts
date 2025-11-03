import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  id: string;
  email: string;
  fullName: string;
}

interface UserSliceState {
  userData: UserData;
}

const initialState: UserSliceState = {
  userData: { id: "", email: "", fullName: "" },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    clearUser: (state) => {
      state.userData = { id: "", email: "", fullName: "" };
    },
  },
});

export const { setUser,clearUser } = userSlice.actions;
export default userSlice.reducer;
