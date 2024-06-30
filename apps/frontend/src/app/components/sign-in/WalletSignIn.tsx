// WalletSignInButton.jsx
"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const customStyles = {
  backgroundColor: '#ef4444',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  border: 'none',
  cursor: 
  'pointer',
  

};
export const WalletSignInButton = () => {
  const WalletMultiButtonDynamic = dynamic(
    async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  return <WalletMultiButtonDynamic style={customStyles}/>;
};
