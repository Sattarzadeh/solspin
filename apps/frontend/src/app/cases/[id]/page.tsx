"use client";

import { CaseDetails } from "./components/CaseDetails";
import { CaseItems } from "./components/CaseItems";
import React from "react";
import { PreviousDrops } from "./components/PreviousDrops";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { toggleDemoClicked } from "../../../store/slices/demoSlice";
import { CaseCarousel } from "./components/CaseCarousel";

const caseExample = {
  name: "Watson Power",
  price: 4.99,
  rarity: "Extrodinary",
  tag: "Hot",
  image: "/cases/dota_3.svg",
};

export default function CasePage({ params }: { params: { id: string } }) {
  const demoClicked = useSelector((state: RootState) => state.demo.demoClicked);
  const dispatch = useDispatch();

  const id = params.id;

  const handleDemoClick = (clicked: boolean): boolean => {
    console.log("re render");
    if (!demoClicked) {
      dispatch(toggleDemoClicked());
    }
    return true;
  };
  return (
    <div className="w-full h-full flex flex-col space-y-10 p-2">
      <CaseDetails {...caseExample} />
      <CaseCarousel />
      <CaseItems />
      <PreviousDrops />
    </div>
  );
}
