"use client";

import { ICase } from "../hooks/useCases";
import { CaseSkeleton } from "./skeletons/CaseSkeleton";
import dynamic from "next/dynamic";

const DynamicCase = dynamic(() => import("./Case"), { ssr: false });

interface CaseProps {
  cases: ICase[];
}

// TODO - Remove dynamic import and use SSR

export const Cases: React.FC<CaseProps> = ({ cases }) => {
  const isLoading = false;
  return (
    <div className="grid grid-cols-dynamic gap-6 justify-center grid-flow-row-dense cases-container">
      {cases.map((item, index) => (
        <>
          {isLoading ? (
            <CaseSkeleton key={index} {...item} />
          ) : (
            <DynamicCase key={index} {...item} />
          )}
        </>
      ))}
    </div>
  );
};
