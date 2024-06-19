import React from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatBody } from "./ChatBody";
import { ChatInput } from "./ChatInput";

export const Chatbar = () => {
  return (
    <div className="top-0 left-0 overflow-y-auto h-full flex flex-col justify bg-custom_gray w-80 z-50 fixed">
      <ChatHeader />
      <ChatBody />
      <ChatInput />
    </div>
  );
};
