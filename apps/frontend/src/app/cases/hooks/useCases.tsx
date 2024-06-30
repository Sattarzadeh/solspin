"use client";

import { useMemo, useState } from "react";

export interface ICase {
  name: string;
  price: number;
  rarity: string;
  tag: string;
  image: string;
  highestPrice: number;
  lowestPrice: number;
}

const cases = Array.from({ length: 50 }, () => {
  return {
    name: Math.random() < 0.5 ? "Watson Power" : "Fire Hand Mystery",
    price: Math.round(Math.random() * 1000),
    rarity: Math.random() < 0.5 ? "Exceptional" : "Exotic",
    tag: Math.random() < 0.33 ? "Hot" : Math.random() < 0.66 ? "New" : "Special",
    image:
      Math.random() < 0.33
        ? "/cases/dota_3.svg"
        : Math.random() < 0.66
        ? "/cases/case-example-2.svg"
        : "/cases/case-examle-3.svg",
    highestPrice: 1000,
    lowestPrice: 0.01,
  };
});

interface IFilters {
  category: string[];
  rarity: string[];
  order: string[];
  price: string[];
}

export const useCases = () => {
  const [filters, setFilters] = useState<IFilters>({
    category: [],
    rarity: [],
    order: [],
    price: [],
  });

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      return (
        (filters.category.length === 0 || filters.category.includes(item.tag)) &&
        (filters.rarity.length === 0 || filters.rarity.includes(item.rarity)) &&
        (filters.price.length === 0 || filters.price.includes(item.price.toString()))
      );
    });
  }, [filters]);

  const sortedCases = useMemo(() => {
    const sortedCases = [...filteredCases];

    if (filters.order.includes("Ascending price")) {
      sortedCases.sort((a, b) => a.price - b.price);
    } else if (filters.order.includes("Descending price")) {
      sortedCases.sort((a, b) => b.price - a.price);
    } else if (filters.order.includes("Popularity (High to Low)")) {
      sortedCases.sort((a, b) => b.highestPrice - a.highestPrice);
    } else if (filters.order.includes("Popularity (Low to High)")) {
      sortedCases.sort((a, b) => a.highestPrice - b.highestPrice);
    } else if (filters.order.includes("Newest")) {
      sortedCases.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.order.includes("Oldest")) {
      sortedCases.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sortedCases;
  }, [filteredCases, filters.order]);

  const updateFilters = (filterType: string, selectedOptions: string[]) => {
    setFilters((prevFilters) => {
      return {
        ...prevFilters,
        [filterType]: selectedOptions,
      };
    });
  };

  return { cases: sortedCases, updateFilters };
};
