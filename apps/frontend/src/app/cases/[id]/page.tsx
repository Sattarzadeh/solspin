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
  }, [isDemoClicked]);

  console.log("cases rerendered", cases[0]?.name, cases[1]?.name, cases[2]?.name);
  return (
    <div className="w-full h-full flex flex-col space-y-10 p-2">
      <CaseDetails {...caseExample} />
      <CaseCarousel cases={cases} isDemoClicked={isDemoClicked} />
      <CaseItems />
      <PreviousDrops />
    </div>
  );
}
