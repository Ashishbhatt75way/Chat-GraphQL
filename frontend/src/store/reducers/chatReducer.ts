import { createSlice } from "@reduxjs/toolkit";

interface Message {
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  id: string;
}

const initialState = { messages: [] as Message[] };

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage: (state, action: { payload: Message }) => {
      state.messages.push(action.payload);
    },
  },
});

export const { addMessage } = messageSlice.actions;
export default messageSlice.reducer;
