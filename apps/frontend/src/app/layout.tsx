"use client";

import "./global.css";
import React from "react";
import { NavBar } from "./components/navbar/NavBar";
import { Providers } from './providers'
import { Chatbar } from "./components/chatbar/Chatbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setChatOpen] = React.useState(true);

  const toggleChatOpen = () => {
    setChatOpen(!isChatOpen);
  };

  return (
    <html lang="en" className="w-full h-full">
      <body className="flex flex-col w-full h-full overflow-hidden bg-background">
        <Providers>
          <NavBar />
          <div className="flex flex-1 overflow-hidden relative">
            <Chatbar chatOpenCallback={toggleChatOpen} />
            <main className="flex-grow overflow-y-auto relative h-full transition-all duration-500 ease-in-out bg-main_background">
              <div className="min-h-full">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}