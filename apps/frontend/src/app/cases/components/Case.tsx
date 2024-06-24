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
}

export const Case: React.FC<CaseProps> = ({ name, price, rarity, tag, image }) => {
  return (
    <Link href={`/cases/${name}`}>
      <div className="relative rounded-md hover:cursor-pointer shadow-lg case p-4">
        <Tag name={tag} customStyle={"absolute top-6 left-6"} />
        <div className="relative h-3/4">
          <Image
            src={image}
            alt={name}
            layout="responsive"
            width={225}
            height={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
    </Link>
  );
};
