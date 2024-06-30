"use client";

import React from "react";
import { ChatBody } from "./ChatBody";
import { ChatInput } from "./ChatInput";
import { ExpandButton } from "./ExpandButton";
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
      className="absolute md:relative h-[calc(100dvh-5rem)] z-40 transition-all duration-500 ease-in-out flex-shrink-0 bg-background chat-bar shadow-2xl"
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
        <ChatBody />
        <ChatInput />
      </div>
      <div
        className={`absolute bottom-12 -right-12 transform translate-x-full -translate-y-1/2 transition-transform duration-500 ${
          isChatOpen ? "hidden" : ""
        }`}
      >
        <ExpandButton toggleChatOpen={toggleChatOpen} />
      </div>
      <div
        className={`absolute top-6 right-12 transform translate-x-full -translate-y-1/2 transition-transform duration-500 ${
          !isChatOpen ? "hidden" : ""
        }`}
      >
        <DismissButton toggleChatClose={toggleChatOpen} />
      </div>
    </div>
  );
};
