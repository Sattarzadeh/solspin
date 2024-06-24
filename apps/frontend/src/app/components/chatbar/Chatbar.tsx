"use client";

import React from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatBody } from "./ChatBody";
import { ChatInput } from "./ChatInput";
import { DismissButton } from "./DismissButton";

interface ChatbarProps {
  chatOpenCallback: () => void;
}

export const Chatbar: React.FC<ChatbarProps> = ({ chatOpenCallback }) => {
  const [isChatOpen, setChatOpen] = React.useState(true);

  const toggleChatOpen = () => {
    setChatOpen(!isChatOpen);
    chatOpenCallback();
  };

  return (
    <div
      className="absolute md:relative h-[calc(100dvh-5rem)] z-20 transition-all duration-500 ease-in-out flex-shrink-0 bg-background chat-bar shadow-2xl"
      style={{
        width: isChatOpen ? "320px" : "0px", // Adjust the collapsed width as needed
      }}
    >
      <div
        className={`h-full flex flex-col justify-between shadow-2xl transition-transform duration-500`}
        style={{
          width: "320px",
          transform: isChatOpen ? "translateX(0)" : "translateX(-320px)", // Adjust based on your collapsed width
        }}
      >
        <ChatHeader />
        <ChatBody />
        <ChatInput />
      </div>
      <div
        className={`absolute bottom-5 right-0 transform translate-x-full -translate-y-1/2 transition-transform duration-500 ${
          isChatOpen ? "" : "rotate-180"
        }`}
      >
        <DismissButton toggleChatOpen={toggleChatOpen} />
      </div>
    </div>
  );
};
