// src/store/slices/demoSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface DemoState {
  demoClicked: boolean;
  numCases: number;
}

const initialState: DemoState = {
  demoClicked: false,
  numCases: 1,
};

const demoSlice = createSlice({
  name: "demo",
  initialState,
  reducers: {
    toggleDemoClicked(state) {
      state.demoClicked = !state.demoClicked;
    },
    setNumCases(state, action) {
      state.numCases = action.payload;
    },
  },
});

export const { toggleDemoClicked, setNumCases } = demoSlice.actions;
export default demoSlice.reducer;
