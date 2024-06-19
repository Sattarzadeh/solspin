import React from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatBody } from "./ChatBody";
import { ChatInput } from "./ChatInput";

export const Chatbar = () => {
  return (
    <div className="left-0 h-full flex flex-col justify-between w-80 z-20 fixed chat-bar flex-nowrap">
      <ChatHeader />
      <ChatBody />
      <ChatInput />
    </div>
  );
};
