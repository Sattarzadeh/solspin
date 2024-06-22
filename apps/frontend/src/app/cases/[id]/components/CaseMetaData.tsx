import React from "react";
import { Tag } from "../../components/Tag";
import { useDispatch, useSelector } from "react-redux";
import { toggleDemoClicked } from "../../../../store/slices/demoSlice";
import { RootState } from "../../../../store";

interface CaseMetaDataProps {
  name: string;
  highestPrice: number;
  lowestPrice: number;
  totalItems: number;
  price: number;
  label: string;
}

export const CaseMetaData: React.FC<CaseMetaDataProps> = ({
  name,
  highestPrice,
  lowestPrice,
  totalItems,
  price,
  label,
}) => {
  const dispatch = useDispatch();
  const selector = useSelector((state: RootState) => state.demo.demoClicked);
  return (
    <div className="flex flex-col justify-between items-start w-full space-y-4">
      <div className="flex space-x-3 justify-between items-center">
        <span className="text-white font-bold text-lg">{name}</span>
        <Tag name={label} customStyle={""} />
      </div>
      <div className="flex space-x-1 justify-between items-center">
        <span className="text-white text-sm">Highest Item</span>
        <span className="text-white text-sm">${highestPrice}</span>
        <span className="text-white text-sm">·</span>
        <span className="text-white text-sm">Lowest Item</span>
        <span className="text-white text-sm">${lowestPrice}</span>
        <span className="hidden sm:block text-white text-sm">·</span>
        <span className="hidden sm:block text-white text-sm">Total Items</span>
        <span className="hidden sm:block text-white text-sm">{totalItems}</span>
      </div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-between items-center sm:items-start">
        <div className="flex space-x-2 justify-between items-center">
          <button className="bg-custom_gray  rounded-md w-12 h-12 p-2">
            <span className="text-white">1</span>
          </button>
          <button className="bg-custom_gray  rounded-md w-12 h-12 p-2">
            <span className="text-white">1</span>
          </button>
          <button className="bg-custom_gray  rounded-md w-12 h-12 p-2">
            <span className="text-white">1</span>
          </button>
          <button className="bg-custom_gray  rounded-md w-12 h-12 p-2">
            <span className="text-white">1</span>
          </button>
        </div>
        <button className="flex bg-green-500 rounded-md h-12 p-4 space-x-1 justify-center items-center">
          <span className="text-white font-semibold">Open 1 Case</span>
          <span className="hidden sm:block text-white font-semibold text-sm">·</span>
          <span className="text-white font-semibold">${price}</span>
        </button>
        <div className="flex justify-between items-center space-x-2">
          <button
            className="flex justify-center items-center bg-custom_gray rounded-md h-12 p-3"
            onClick={() => {
              if (!selector) {
                dispatch(toggleDemoClicked());
              }
            }}
          >
            <span className="text-white">Demo</span>
          </button>
          <button className="flex justify-center items-center bg-custom_gray rounded-md h-12 p-3">
            <span className="text-white">Quick</span>
          </button>
        </div>
      </div>
    </div>
  );
};
