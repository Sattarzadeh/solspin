import React from "react";

export const CaseSkeleton = () => {
  return (
    <div className="relative rounded-md shadow-lg p-2 overflow-hidden bg-gray-900 case">
      <div className="absolute top-4 left-4 w-12 h-6 bg-gray-900 rounded shimmer"></div>
      <div className="relative w-4/5 mx-auto top-10 h-[175px] bg-gray-900 rounded shimmer"></div>
      <div className="absolute bottom-6 left-6 right-4 flex justify-between items-end">
        <div className="relative w-3/5">
          <div className="w-full h-4 bg-gray-800 rounded mb-1 shimmer"></div>
        </div>
        <div className="flex items-center justify-end space-x-1">
          <div className="w-6 h-6 bg-gray-900 rounded-full shimmer"></div>
          <div className="w-12 h-4 bg-gray-900 rounded shimmer"></div>
        </div>
      </div>
    </div>
  );
};
