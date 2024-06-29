"use client";

import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleDepositClicked } from "../../../store/slices/navbarSlice";

export const Balance = () => {
  const [balance, setBalance] = useState(100);
  const dispatch = useDispatch();

  const handleDepositClick = () => {
    dispatch(toggleDepositClicked());
  };

  return (
    <div className="rounded-lg bg-gray-700 flex items-center justify-between">
      <div className="flex space-x-2 items-center px-4">
        <Image src="/icons/dollar.svg" alt="dollar" width={20} height={20} />
        <span className="text-lg text-white">{balance}</span>
      </div>
      <button
        className="rounded-lg bg-green-500 p-2 w-12 h-12 hover:bg-green-400 hover:scale-105 duration-100"
        onClick={() => handleDepositClick()}
      >
        <span className="text-white text-2xl font-bold">+</span>
      </button>
    </div>
  );
};
