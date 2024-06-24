import React from "react";

interface TagProps {
  name: string;
  customStyle: string;
}

export const Tag: React.FC<TagProps> = ({ name, customStyle }) => {
  return (
    <div
      className={`${customStyle} ${
        name === "New" ? "gradient-background text-black" : "bg-red-500  text-white"
      } text-xs font-bold px-2 py-1 rounded`}
    >
      {name}
    </div>
  );
};
