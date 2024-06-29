import { createSlice } from "@reduxjs/toolkit";

interface NacbarState {
  isDepositOpen: boolean;
  isWithdrawOpen: boolean;
}

const initialState: NacbarState = {
  isDepositOpen: false,
  isWithdrawOpen: false,
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    toggleDepositClicked(state) {
      state.isDepositOpen = !state.isDepositOpen;
    },
    toggleWithdrawClicked(state) {
      state.isWithdrawOpen = !state.isWithdrawOpen;
    },
  },
});

export const { toggleDepositClicked, toggleWithdrawClicked } = navbarSlice.actions;
export default navbarSlice.reducer;
