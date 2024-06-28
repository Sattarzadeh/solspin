"use client";

import { Chatbar } from "./chatbar/Chatbar";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { DepositPopUp } from "./navbar/DepositPopUp";
import { toggleDepositClicked } from "../../store/slices/navbarSlice";

export const MainSection = ({ children }: { children: React.ReactNode }) => {
  const [isChatOpen, setChatOpen] = React.useState(true);
  const dispatch = useDispatch();
  const isDepositOpen = useSelector((state: RootState) => state.navbar.isDepositOpen);

  const toggleChatOpen = () => {
    setChatOpen(!isChatOpen);
  };

  const toggleDepositOpen = () => {
    dispatch(toggleDepositClicked());
  };

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {isDepositOpen && <DepositPopUp handleClose={toggleDepositOpen} />}
      <Chatbar chatOpenCallback={toggleChatOpen} />
      <main className="flex-grow overflow-y-auto relative h-full transition-all duration-500 ease-in-out bg-main_background">
        <div className="min-h-full">{children}</div>
      </main>
    </div>
  );
};
