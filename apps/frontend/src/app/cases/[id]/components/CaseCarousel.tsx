"use client";

import React, { useEffect, useMemo, useReducer, useRef } from "react";
import Image from "next/image";
import { CarouselItem } from "./CarouselItem";
import { ICase } from "../../hooks/useCases";

type AnimationCalculation = {
  distance: number;
  tickerOffset: number;
};

interface CaseCarouselProps {
  cases: ICase[];
  isDemoClicked: boolean;
  numCases: number;
  onAnimationComplete: () => void;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
  return {
    distance: -randomAnimationDistance,
    tickerOffset: animationDistanceBounds.midpoint - randomAnimationDistance,
  };
};

// Define action types
enum Action {
  RESET,
  START_ANIMATION,
  FIRST_STAGE_END,
  SECOND_STAGE_END,
}

// Define the state type
type State = {
  animationStage: number;
  offset: AnimationCalculation;
};

// Reducer function
function carouselReducer(state: State, action: Action): State {
  switch (action) {
    case Action.RESET:
      return { animationStage: 0, offset: { distance: 0, tickerOffset: 0 } };
    case Action.START_ANIMATION:
      return { ...state, animationStage: 1, offset: animationCalculation() };
    case Action.FIRST_STAGE_END:
      return { ...state, animationStage: 2 };
    case Action.SECOND_STAGE_END:
      return { ...state, animationStage: 3 };
    default:
      return state;
  }
}

const CaseCarousel: React.FC<CaseCarouselProps> = React.memo(
  ({ cases, isDemoClicked, numCases, onAnimationComplete }) => {
    const [state, dispatch] = useReducer(carouselReducer, {
      animationStage: 0,
      offset: { distance: 0, tickerOffset: 0 },
    });

    const carouselRef = useRef<HTMLDivElement | null>(null);
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if ((state.animationStage === 3 || state.animationStage === 0) && isDemoClicked) {
        dispatch(Action.RESET);
      }
    }, [cases, isDemoClicked]);

    useEffect(() => {
      if (isDemoClicked && state.animationStage === 0) {
        dispatch(Action.START_ANIMATION);
      }
    }, [isDemoClicked, state.animationStage]);

    useEffect(() => {
      const handleTransitionEnd = () => {
        if (state.animationStage === 1) {
          dispatch(Action.FIRST_STAGE_END);
        } else if (state.animationStage === 2) {
          console.log("Second stage end");
          onAnimationComplete();
          dispatch(Action.SECOND_STAGE_END);
        }
      };

      const carousel = carouselRef.current;
      if (carousel) {
        carousel.addEventListener("transitionend", handleTransitionEnd);
        return () => carousel.removeEventListener("transitionend", handleTransitionEnd);
      }
    }, [state.animationStage, onAnimationComplete]);

    // Cleanup effect
    useEffect(() => {
      return () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
      };
    }, []);

    const carouselStyle = useMemo(() => {
      const { distance, tickerOffset } = state.offset;
      const transformDistance =
        state.animationStage === 1
          ? distance
          : state.animationStage === 2 || state.animationStage === 3
          ? distance - tickerOffset
          : 0;

      return {
        "--transform-distance": `${transformDistance}px`,
        transform:
          numCases > 1
            ? `translateY(var(--transform-distance))`
            : `translateX(var(--transform-distance))`,
        transition:
          state.animationStage === 1
            ? "transform 5s cubic-bezier(0, 0.49, 0.1, 1)"
            : state.animationStage === 2
            ? "transform 1s"
            : "none",
      } as React.CSSProperties & { "--transform-distance": string };
    }, [state.animationStage, state.offset, numCases]);

    console.log("Rendering CaseCarousel", state);

    return (
      <div
        className={`relative ${
          numCases > 1 ? "py-0 lg:py-0" : "lg:py-2"
        } rounded-md main-element flex-grow w-full`}
      >
        <Image
          src="/icons/down-arrow.svg"
          alt="Arrow Down"
          width={24}
          height={24}
          className={`absolute ${
            numCases > 1 ? "inset-y-0 left-[-10px] my-auto" : "inset-x-0 top-[-10px] mx-auto"
          } z-10 transition-colors duration-1000 text-yellow-2 bg-amber-300`}
        />
        <div
          className={`mt-md flex overflow-hidden rounded-sm flex-col gap-xs h-[310px] xl:h-[180px] ${
            numCases > 1 ? "xl:h-[310px]" : ""
          }`}
        >
          <div className="relative mx-auto my-0 flex h-full items-center justify-center overflow-hidden bg-dark-4 w-full">
            <div
              ref={carouselRef}
              className={`flex transform-gpu will-change-transform carousel-animation ${
                numCases > 1 ? "flex-row sm:flex-col" : "sm:flex-row flex-col"
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
    );
  }
);

CaseCarousel.displayName = "CaseCarousel";

export { CaseCarousel };
