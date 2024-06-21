import { CaseItem } from "./CaseItem";

export const CaseItems = () => {
  return (
    <div className="flex flex-col space-y-5">
      <span className="text-white text-lg">Case Items</span>
      <div className="grid grid-cols-dynamic gap-6 justify-center md:justify-start grid-flow-row-dense">
        <CaseItem />
        <CaseItem />
        <CaseItem />
        <CaseItem />
        <CaseItem />
        <CaseItem />
        <CaseItem />
      </div>
    </div>
  );
};
