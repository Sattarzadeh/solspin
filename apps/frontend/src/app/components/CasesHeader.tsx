import FilterDropdownMenu from "./FilterDropdownMenu";
import { Search } from "./Search";
import React from "react";

const options1 = ["Option 1-1", "Option 1-2", "Option 1-3"];

const dropdownItems = [
  {
    title: "Category",
    options: ["Category 1", "Category 2", "Category 3"],
    onSelect: () => {},
  },
  {
    title: "Rarity",
    options: ["Rarity 1", "Rarity 2", "Rarity 3"],
    onSelect: () => {},
  },
  {
    title: "Order",
    options: ["Order 1", "Order 2", "Order 3"],
    onSelect: () => {},
  },
  {
    title: "Price",
    options: ["Price 1", "Price 2", "Price 3"],
    onSelect: () => {},
  },
];

export const CasesHeader = () => {
  return (
    <div className="w-full flex justify-between px-8 py-6 items-center">
      <span className="text-m font-bold text-white gradient-text">Cases</span>
      <div className={"space-x-8 flex justify-between items-end"}>
        <div className={"flex space-x-4"}>
          {dropdownItems.map((item) => (
            <div className={"flex flex-col space-y-0.5"}>
              <span className={"text-2xs text-white ml-1.5"}>{item.title}</span>
              <FilterDropdownMenu
                key={item.title}
                title={item.title}
                options={item.options}
                onSelect={item.onSelect}
              />
            </div>
          ))}
        </div>
        <Search />
      </div>
    </div>
  );
};
