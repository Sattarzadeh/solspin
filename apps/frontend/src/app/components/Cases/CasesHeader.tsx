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
    <div className="w-full flex justify-between py-8 items-center">
      <div className="flex w-full justify-between items-end space-x-2">
        <div className="hidden lg:flex space-x-4">
          {dropdownItems.map((item) => (
            <div key={item.title} className="flex flex-col space-y-0.5">
              <span className="text-2xs text-white ml-1.5">{item.title}</span>
              <FilterDropdownMenu
                key={item.title}
                title={item.title}
                options={item.options}
                onSelect={item.onSelect}
              />
            </div>
          ))}
        </div>
        <button className="lg:hidden flex-1 h-10 bg-custom_gray text-white rounded text-xs font-semibold">
          Filters
        </button>
        <div className="lg:flex-grow-0 lg:flex-shrink lg:basis-auto flex-1 h-10 overflow-clip">
          <Search />
        </div>
      </div>
    </div>
  );
};
