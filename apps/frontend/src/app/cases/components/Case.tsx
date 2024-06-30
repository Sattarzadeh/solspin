import React from "react";
import Image from "next/image";
import { Tag } from "./Tag";
import Link from "next/link";

export interface CaseProps {
  name: string;
  price: number;
  rarity: string;
  tag: string;
  image: string;
  highestPrice: number;
  lowestPrice: number;
}

export const Case: React.FC<CaseProps> = ({
  name,
  price,
  rarity,
  tag,
  image,
  highestPrice,
  lowestPrice,
}) => {
  return (
    <Link href={`/cases/${name}`}>
      <div
        className={`relative rounded-md hover:cursor-pointer shadow-lg case-${rarity.toLowerCase()} p-2 group overflow-hidden`}
      >
        <Tag name={tag} customStyle={"absolute top-4 left-4"} />
        <div className="relative -top-4">
          <Image
            src={image}
            alt={name}
            width={250}
            height={100}
            objectFit="contain"
            className="group-hover:scale-95 duration-300 ease-in-out"
          />
        </div>
        <div className="absolute bottom-6 left-6 right-4 flex justify-between items-end">
          <div className="relative">
            <span className="text-white font-bold text-sm absolute bottom-0 left-0 group-hover:opacity-0 transition-opacity duration-300">
              {name}
            </span>
            <div className="flex-col items-start justify-start w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
              <span className="text-white font-bold text-xs opacity-50 block mb-1 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                Least expensive item · ${lowestPrice}
              </span>
              <span className="text-white font-bold text-sm block whitespace-nowrap overflow-hidden text-ellipsis w-full">
                Most expensive item · ${highestPrice}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-1 group-hover:opacity-0 transition-opacity duration-300">
            <img src="/icons/dollar.svg" alt="Dollar" className="h-6 w-6" />
            <span className="gradient-text">{price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
