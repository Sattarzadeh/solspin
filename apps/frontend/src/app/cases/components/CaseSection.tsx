import React from "react";
import { CasesHeader } from "./CasesHeader";
import { Cases } from "./Cases";

export const CaseSection = () => {
  return (
    <div className="w-full h-full flex-col justify-between items-center px-8">
      <CasesHeader />
      <Cases />
    </div>
  );
};
