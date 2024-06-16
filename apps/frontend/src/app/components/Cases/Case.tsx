import React from "react";
import Image from "next/image";

interface CaseProps {
  name: string;
  price: number;
  rarity: string;
  tag: string;
  image: string;
}

export const Case: React.FC<CaseProps> = ({ name, price, rarity, tag, image }) => {
  return (
    <div className="relative rounded-md hover:cursor-pointer shadow-lg case p-4">
      <div
        className={`absolute top-6 left-6 ${
          tag === "New" ? "gradient-background text-black" : "bg-red-500  text-white"
        } text-xs font-bold px-2 py-1 rounded`}
      >
        {tag}
      </div>
      <div className="relative h-3/4">
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="contain"
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-6 left-6 right-4 flex justify-between items-center">
        <span className="text-white font-bold text-sm">{name}</span>
        <div className="flex items-center justify-between gap-1">
          <img src="/icons/dollar.svg" alt="Dollar" className="h-6 w-6" />
          <span className="gradient-text">{price}</span>
        </div>
      </div>
    </div>
  );
};
