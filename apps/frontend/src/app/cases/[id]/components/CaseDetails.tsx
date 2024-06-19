import React from "react";
import Image from "next/image";
import { CaseMetaData } from "./CaseMetaData";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "apps/frontend/src/store";

interface CaseDetailsProps {
  name: string;
  price: number;
  rarity: string;
  tag: string;
  image: string;
}

export const CaseDetails: React.FC<CaseDetailsProps> = ({ name, price, rarity, tag, image }) => {
  const isDemo = useSelector((state: RootState) => state.demo.demoClicked);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col sm:flex-row justify-start sm:items-center items-start w-full space-y-4">
      <div className="relative">
        <Image
          src={image}
          alt={name}
          height={100}
          width={225}
          objectFit="contain"
          className="object-contain"
        />
      </div>
      <CaseMetaData
        name={name}
        highestPrice={200}
        lowestPrice={1}
        totalItems={12}
        price={price}
        label={tag}
      />
    </div>
  );
};
