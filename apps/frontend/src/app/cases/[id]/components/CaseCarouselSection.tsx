import { CaseCarousel } from "./CaseCarousel";

export const CaseCarouselSection = () => {
  return (
    <div className="flex flex-col justify-between items-center w-full h-64 bg-custom_gray rounded-md py-4 px-6">
      <div className="flex items-center justify-end w-full">
        <span className="text-white hover:cursor-pointer">Provably Fair</span>
      </div>
      <CaseCarousel />
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center justify-between space-x-2"></div>
      </div>
    </div>
  );
};
