import { CaseCarouselSection } from "./components/CaseCarouselSection";
import { CaseDetails } from "./components/CaseDetails";
import { CaseItems } from "./components/CaseItems";
import React from "react";
import { PreviousDrops } from "./components/PreviousDrops";

const caseExample = {
  name: "Watson Power",
  price: 4.99,
  rarity: "Extrodinary",
  tag: "Hot",
  image: "/cases/dota_3.svg",
};

export default function CasePage({ params }: { params: { id: string } }) {
  const id = params.id;

  return (
    <div className="w-full h-full flex flex-col space-y-10">
      <CaseDetails {...caseExample} />
      <CaseCarouselSection />
      <CaseItems />
      <PreviousDrops />
    </div>
  );
}
