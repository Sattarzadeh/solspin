"use client";

import React from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatBody } from "./ChatBody";
import { ChatInput } from "./ChatInput";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export const Chatbar = () => {
  const isOpen = useSelector((state: RootState) => state.chatBar.chatBarOpen);

  return (
    <div
      className={`left-0 top-20 h-[calc(100dvh-5rem)] flex flex-col justify-between w-80 z-20 sticky chat-bar`}
      style={{
        transform: isOpen ? `translate3d(-320px, 0px, 0px)` : `translate3d(0px, 0px, 0px)`,
        transitionDuration: "500ms",
      }}
    >
      <ChatHeader />
      <ChatBody />
      <ChatInput />
    </div>
  );
};
