"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CarouselItem } from "./CarouselItem";
import { useDispatch } from "react-redux";
import { toggleDemoClicked } from "../../../../store/slices/demoSlice";
import { CaseProps } from "../../components/Case";

type CarouselStyle = React.CSSProperties & {
  "--transform-distance": string;
};

type AnimationCalculation = {
  distance: number;
  tickerOffset: number;
};

interface CaseCarouselProps {
  cases: CaseProps[];
  isDemoClicked: boolean;
  numCases: number;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 * This function calculates the animation distance for the carousel from its starting position to its ending position.
 * This process is random to give the carousel a non-deterministic feel (i.e. it doesn't always move the same distance).
 */

const itemWidth = 176;
const distanceInItems = 25;
const animationDistanceBounds = {
  lower: (distanceInItems - 0.5) * itemWidth,
  upper: (distanceInItems + 0.5) * itemWidth,
  midpoint: distanceInItems * itemWidth,
};

const animationCalculation = (): AnimationCalculation => {
  const randomAnimationDistance = getRandomInt(
    animationDistanceBounds.lower,
    animationDistanceBounds.upper
  );
  // Offset the ticker to the midpoint of the animation distance

  return {
    distance: -randomAnimationDistance,
    tickerOffset: animationDistanceBounds.midpoint - randomAnimationDistance,
  };
};

export const CaseCarousel: React.FC<CaseCarouselProps> = ({ cases, isDemoClicked, numCases }) => {
  const [offset, setOffset] = useState<AnimationCalculation>({
    distance: 0,
    tickerOffset: 0,
  });
  const [animationStage, setAnimationStage] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("cases changed", animationStage, offset);
    if (animationStage === 3) {
      setAnimationStage(0);
      setOffset({ distance: 0, tickerOffset: 0 });
    }
  }, [cases]);

  const startAnimation = useCallback(() => {
    if (animationStage !== 0) return;
    setAnimationStage(1);
    const animationInfoCalc = animationCalculation();
    setOffset(animationInfoCalc);
  }, [animationStage]);

  useEffect(() => {
    if (isDemoClicked && animationStage === 0) {
      startAnimation();
    }
  }, [isDemoClicked, animationStage, startAnimation]);

  const handleFirstStageEnd = useCallback(() => {
    setAnimationStage(2);
  }, []);

  const handleSecondStageEnd = useCallback(() => {
    dispatch(toggleDemoClicked());
    setAnimationStage(3);
  }, []);

  const handleTransitionEnd = useCallback(() => {
    if (animationStage === 1) {
      handleFirstStageEnd();
    } else if (animationStage === 2) {
      handleSecondStageEnd();
    }
  }, [animationStage, handleFirstStageEnd, handleSecondStageEnd]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("transitionend", handleTransitionEnd);
      return () => carousel.removeEventListener("transitionend", handleTransitionEnd);
    }
  }, [handleTransitionEnd]);

  const transformDistance =
    animationStage == 1
      ? offset.distance
      : animationStage == 2 || (animationStage == 3 && !isDemoClicked)
      ? offset.distance - offset.tickerOffset
      : 0;

  const carouselStyle: CarouselStyle = {
    "--transform-distance": `${transformDistance}px`,
    transform: "translateY(var(--transform-distance))",
    transition:
      animationStage === 1
        ? "transform 6s ease-in-out"
        : animationStage === 2
        ? "transform 0.5s ease-in-out"
        : "none",
  };

  return (
    <div className="py-12 px-6 rounded-md main-element flex-grow w-full ">
      <div className="relative shadow-lg">
        <Image
          src="/icons/down-arrow.svg"
          alt="Arrow Down"
          width={24}
          height={24}
          className="absolute inset-x-0 top-[-10px] z-10 mx-auto transition-colors duration-1000 text-yellow-2 bg-amber-300"
        />
        <div
          className={`mt-md flex overflow-hidden rounded-sm flex-col gap-xs h-[310px] xl:h-[180px]`}
        >
          <div className="relative mx-auto my-0 flex h-full items-center justify-center overflow-hidden bg-dark-4 w-full">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-search_bar_gray z-10"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-search_bar_gray z-10"></div>
            </div>
            <div
              ref={carouselRef}
              className={`flex sm:flex-row transform-gpu will-change-transform carousel-animation ${
                numCases > 1 ? "flex-col" : "sm:flex-row flex-col"
              }`}
              style={carouselStyle}
            >
              {cases.map((item, index) => (
                <CarouselItem key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
