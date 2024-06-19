// src/store/slices/demoSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface DemoState {
  demoClicked: boolean;
}

const initialState: DemoState = {
  demoClicked: false,
};

const demoSlice = createSlice({
  name: "demo",
  initialState,
  reducers: {
    toggleDemoClicked(state) {
      state.demoClicked = !state.demoClicked;
    },
  },
});

export const { toggleDemoClicked } = demoSlice.actions;
export default demoSlice.reducer;
