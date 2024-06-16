import "./global.css";
import React from "react";
import { NavBar } from "./components/NavBar";

export const metadata = {
  title: "Welcome to frontend",
  description: "Generated by create-nx-workspace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={"w-dvh h-dvh overflow-x-hidden bg-background overscroll-none"}>
      <body className={"w-full h-full"}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
