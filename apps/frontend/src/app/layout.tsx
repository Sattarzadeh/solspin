"use client";

import "./global.css";
import React from "react";
import { NavBar } from "./components/NavBar";
import store from "../store";
import { Provider } from "react-redux";
import { Chatbar } from "./components/chatbar/Chatbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <html lang="en" className={"w-dvh h-dvh overflow-x-hidden bg-background overscroll-none"}>
        <body className={"w-full h-full"}>
          <NavBar />
          <Chatbar />
          {children}
        </body>
      </html>
    </Provider>
  );
}
