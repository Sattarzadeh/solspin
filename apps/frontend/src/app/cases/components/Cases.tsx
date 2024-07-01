import React, { Suspense } from "react";
import { ICase } from "../hooks/useCases";
import { CaseSkeleton } from "./skeletons/CaseSkeleton";
import dynamic from "next/dynamic";

const DynamicCase = dynamic(() => import("./Case"), {
  loading: () => <CaseSkeleton />,
});

interface CaseProps {
  cases: ICase[];
}

export const Cases: React.FC<CaseProps> = ({ cases }) => {
  return (
    <div className="grid grid-cols-dynamic gap-6 justify-center grid-flow-row-dense cases-container">
      {cases.map((item, index) => (
        <Suspense key={index} fallback={<CaseSkeleton />}>
          <DynamicCase {...item} />
        </Suspense>
      ))}
    </div>
  );
};
