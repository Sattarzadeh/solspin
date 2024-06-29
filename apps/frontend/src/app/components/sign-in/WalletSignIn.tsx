// WalletSignInButton.jsx
"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../context/WebSocketContext";

export const WalletSignInButton = () => {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const { sendMessage, connectionStatus, socket } = useWebSocket();

  const [isSigningTransaction, setIsSigningTransaction] = useState(false);
  const WalletMultiButtonDynamic = dynamic(
    async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  useEffect(() => {
    if (connected && publicKey) {
      const publicKeyString = publicKey.toBase58();
      console.log("Wallet connected:", publicKeyString);

      // Send HTTP request when the wallet connects
      const sendWalletConnectedRequest = async () => {
        try {
          console.log(connection.getBalance(publicKey));
          const response = await fetch(
            "https://ho7nfeet1l.execute-api.eu-west-2.amazonaws.com/wallet-connect",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ walletAddress: publicKeyString }),
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          if (!data.token) {
            throw new Error("Token was not included in the response");
          }
          localStorage.setItem("token", data.token);

          if (connectionStatus === "connected") {
            sendMessage(
              JSON.stringify({
                action: "authenticate",
                token: data.token,
              })
            );
          }
        } catch (error) {
          console.error("Error sending wallet connected request:", error);
        }
      };

      sendWalletConnectedRequest();
    } else {
      if (connectionStatus === "connected") {
        const token = localStorage.getItem("token");

        if (token) {
          sendMessage(
            JSON.stringify({
              action: "unauthenticate",
              token: token,
            })
          );
        }
      }
      localStorage.removeItem("token");
    }
  }, [connected, publicKey]);

  return <WalletMultiButtonDynamic />;
};
