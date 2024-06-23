import { createSlice } from "@reduxjs/toolkit";

interface ChatBarState {
  chatBarOpen: boolean;
}

const initialState: ChatBarState = {
  chatBarOpen: true,
};

const chatbarSlice = createSlice({
  name: "chatBar",
  initialState,
  reducers: {
    toggleChatBarClicked(state) {
      state.chatBarOpen = !state.chatBarOpen;
    },
  },
});

export const { toggleChatBarClicked } = chatbarSlice.actions;
export default chatbarSlice.reducer;
