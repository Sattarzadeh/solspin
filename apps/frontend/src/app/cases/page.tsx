"use client";

import React from "react";
import { CasesHeader } from "./components/CasesHeader";
import { Cases } from "./components/Cases";
import { useCases } from "./hooks/useCases";

export default function CasesPage() {
  const { cases, updateFilters } = useCases();

  return (
    <div className="w-full h-full flex-col justify-between items-center px-8">
      <CasesHeader updateFilters={updateFilters} />
      <Cases cases={cases} />
    </div>
  );
}
