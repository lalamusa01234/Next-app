import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("token");
    }
  },
});

export const { setUser, clearUser, logout } = userSlice.actions;
export default userSlice.reducer;