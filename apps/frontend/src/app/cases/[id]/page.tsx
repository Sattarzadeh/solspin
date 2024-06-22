"use client";

import { CaseDetails } from "./components/CaseDetails";
import { CaseItems } from "./components/CaseItems";
import React, { useCallback, useEffect, useState } from "react";
import { PreviousDrops } from "./components/PreviousDrops";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { CaseCarousel } from "./components/CaseCarousel";
import { CaseProps } from "../components/Case";

const caseExample = {
  name: "Watson Power",
  price: 4.99,
  rarity: "Extrodinary",
  tag: "Hot",
  image: "/cases/dota_3.svg",
};

export default function CasePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [cases, setCases] = useState<CaseProps[]>([]);
  const isDemoClicked = useSelector((state: RootState) => state.demo.demoClicked);
  const numCases = useSelector((state: RootState) => state.demo.numCases);

  const generateCases = useCallback(() => {
    return Array.from({ length: 59 }, (_, i) => ({
      name: Math.random() < 0.5 ? "XXX" : "YYY",
      price: 4.99,
      rarity: "Extraordinary",
      tag: "Hot",
      image: Math.random() < 0.5 ? "/cases/dota_3.svg" : "/cases/gun.svg",
    }));
  }, [isDemoClicked]);

  useEffect(() => {
    if (isDemoClicked) {
      setCases(generateCases());
    }
  }, [isDemoClicked, generateCases]);

  return (
    <div className="w-full h-full flex flex-col space-y-10 p-2">
      <CaseDetails {...caseExample} />
      <div className="flex flex-col xl:flex-row justify-between items-center w-full">
        {Array.from({ length: numCases }, (_, index) => (
          <CaseCarousel
            key={index}
            cases={cases}
            isDemoClicked={isDemoClicked}
            numCases={numCases}
          />
        ))}
      </div>
      <CaseItems />
      <PreviousDrops />
    </div>
  );
}
