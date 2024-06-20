"use client";

import "./global.css";
import React from "react";
import { NavBar } from "./components/NavBar";
import store from "../store";
import { Provider } from "react-redux";
import { Chatbar } from "./components/chatbar/Chatbar";
import { DismissButton } from "./components/chatbar/DismissButton";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <html lang="en" className={"w-dvh h-dvh overflow-x-hidden bg-background overscroll-none"}>
        <body className={"relative w-full h-full"}>
          <NavBar />
          <div className="flex w-full">
            <div className="w-96">
              <Chatbar />
              <div className="fixed bottom-2.5 left-0 transition-all duration-200 ease-custom">
                <DismissButton />
              </div>
            </div>
            <div className={`relative top-0 overflow-y-auto ${"w-[calc(100dvw-20rem)]"} z-10`}>
              {children}
            </div>
          </div>
        </body>
      </html>
    </Provider>
  );
}
