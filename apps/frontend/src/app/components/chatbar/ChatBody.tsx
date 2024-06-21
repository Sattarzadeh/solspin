import { ChatInputElement } from "./ChatInputElement";
import { useEffect, useRef } from "react";

export const ChatBody = () => {
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatBodyRef.current) return;

    const scrollToBottom = () => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTo({
          top: chatBodyRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    scrollToBottom();
  }, [chatBodyRef.current]);

  return (
    <div className="overflow-y-auto" ref={chatBodyRef}>
      <ChatInputElement />
      <ChatInputElement />
      <ChatInputElement />
      <ChatInputElement />
      <ChatInputElement />
      <ChatInputElement />
      <ChatInputElement />
      <ChatInputElement />
      <ChatInputElement />
      <ChatInputElement />
    </div>
  );
};
