"use client";

import { ICase } from "../hooks/useCases";
import { Case } from "./Case";

interface CaseProps {
  cases: ICase[];
}

export const Cases: React.FC<CaseProps> = ({ cases }) => {
  return (
    <div className="grid grid-cols-dynamic gap-6 justify-center grid-flow-row-dense cases-container">
      {cases.map((item, index) => (
        <Case key={index} {...item} />
      ))}
    </div>
  );
};
