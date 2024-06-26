"use client";

import { CaseDetails } from "./components/CaseDetails";
import { CaseItems } from "./components/CaseItems";
import React, { useCallback, useEffect, useState } from "react";
import { PreviousDrops } from "./components/PreviousDrops";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { CaseCarousel } from "./components/CaseCarousel";
import { CaseProps } from "../components/Case";
import { useWebSocket } from "../../context/WebSocketContext";
import { toggleDemoClicked } from "../../../store/slices/demoSlice";

const caseExample = {
  name: "Watson Power",
  price: 4.99,
  rarity: "Extrodinary",
  tag: "Hot",
  image: "/cases/dota_3.svg",
};

const generateCases = (): CaseProps[] => {
  return Array.from({ length: 59 }, (_, i) => ({
    name: Math.random() < 0.5 ? "XXX" : "YYY",
    price: 4.99,
    rarity: "Extraordinary",
    tag: "Hot",
    image: Math.random() < 0.5 ? "/cases/dota_3.svg" : "/cases/gun.svg",
  }));
};

export default function CasePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [cases, setCases] = useState<CaseProps[]>(generateCases());
  const isDemoClicked = useSelector((state: RootState) => state.demo.demoClicked);
  const numCases = useSelector((state: RootState) => state.demo.numCases);
  const [serverSeedHash, setServerSeedHash] = useState<string | null>(null);
  const [clientSeed, setClientSeed] = useState<string>("");
  const { sendMessage, connectionStatus, socket } = useWebSocket();
  const [generateSeed, setGenerateSeed] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(0);
  const dispatch = useDispatch();

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (isDemoClicked && animationComplete != numCases) {
      setCases(generateCases());
      if (connectionStatus === "connected") {
        sendMessage(
          JSON.stringify({
            action: "caseSpin",
            clientSeed: "awodwad",
            caseId: "1e72ca87-ecc3-4d11-890f-12fb811e20ea",
          })
        );
      }
    }
  }, [isDemoClicked, generateCases]);

  useEffect(() => {
    if (animationComplete === numCases && isDemoClicked) {
      dispatch(toggleDemoClicked());
      setAnimationComplete(0);
    }
  }, [animationComplete, numCases, isDemoClicked, dispatch]);

  useEffect(() => {
    if (connectionStatus === "connected" && generateSeed) {
      sendMessage(JSON.stringify({ action: "generateSeed" }));
      setGenerateSeed(false);
    }
  }, [connectionStatus, sendMessage, generateSeed]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.action === "server-seed-hash") {
        setServerSeedHash(data.hash);
        console.log("Server Seed Hash:", data.hash);
      }

      if (data.action === "spin-result") {
        console.log("Spin result:", data.result);
      }
    };

    if (socket) {
      socket.addEventListener("message", handleMessage);
    }

    return () => {
      if (socket) {
        socket.removeEventListener("message", handleMessage);
      }
    };
  }, [socket]);

  return (
    <div className="w-full h-full flex flex-col space-y-10 p-2">
      <CaseDetails {...caseExample} />
      <div className="flex flex-col xl:flex-row justify-between items-center w-full xl:space-x-2 xl:space-y-0 space-y-2">
        {Array.from({ length: numCases }, (_, index) => (
          <CaseCarousel
            key={index}
            cases={cases}
            isDemoClicked={isDemoClicked}
            numCases={numCases}
            onAnimationComplete={handleAnimationComplete}
          />
        ))}
      </div>
      <CaseItems />
      <PreviousDrops />
    </div>
  );
}
