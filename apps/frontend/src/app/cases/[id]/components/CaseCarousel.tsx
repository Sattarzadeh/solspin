"use client";

import { CarouselItem } from "./CarouselItem";
import { useEffect, useState } from "react";

export const CaseCarousel = () => {
  const [carouselPosition, setCarouselPosition] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCarouselPosition((prevPosition) => prevPosition - 1);
    }, 10); // Adjust the interval duration as needed

    return () => clearInterval(intervalId);
  }, []);

  const carouselStyle = {
    transform: `translate3d(${carouselPosition}px, 0px, 0px)`,
    transitionDuration: "2000ms",
  };

  return (
    <div className="mt-md flex flex-col w-full justify-center overflow-hidden rounded-lg gap-xs h-[310px] xl:h-[180px]">
      <div className="relative flex justify-center items-center w-full h-32 bg-transparent rounded-md mx-auto my-0 space-x-1 overflow-hidden">
        <div className="flex transform-gpu will-change-transform" style={carouselStyle}>
          {Array.from({ length: 30 }).map((_, index) => (
            <CarouselItem key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
