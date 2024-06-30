import React from "react";

interface TagProps {
  name: string;
  customStyle: string;
}

export const Tag: React.FC<TagProps> = ({ name, customStyle }) => {
  return (
    <div
      className={`${customStyle} transition-all duration-75 ease-in-out ${
        name === "New"
          ? "gradient-background text-black"
          : name === "Special"
          ? "text-white bg-yellow-500"
          : "bg-red-500  text-white"
      } text-xs font-bold px-2 py-1 rounded z-10`}
    >
      {name}
    </div>
  );
};
