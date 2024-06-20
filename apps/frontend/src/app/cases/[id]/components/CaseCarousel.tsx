"use client";

import Image from "next/image";
import { CarouselItem } from "./CarouselItem";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "apps/frontend/src/store";
import { toggleDemoClicked } from "../../../../store/slices/demoSlice";

/*
 * This function calculates the animation distance for the carousel from its starting position to its ending position.
 * This process is random to give the carousel a non-deterministic feel (i.e. it doesn't always move the same distance).
 */

type AnimationCalculation = {
  distance: number;
  tickerOffset: number;
};

const distanceInItems = 5;
const itemWidth = 176;
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
  console.log(animationDistanceBounds, randomAnimationDistance);
  // Offset the ticker to the midpoint of the animation distance

  return {
    distance: -randomAnimationDistance,
    tickerOffset: animationDistanceBounds.midpoint - randomAnimationDistance,
  };
};

let cases: any[] = [];

for (let i = 0; i < 49; i++) {
  cases.push({
    name: "Watson Power",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "Hot",
    image: Math.random() < 0.5 ? "/cases/dota_3.svg" : "/cases/gun.svg",
  });
}

export const CaseCarousel = () => {
  const selector = useSelector((state: RootState) => state.demo.demoClicked);
  const dispatch = useDispatch();
  const [animationStep, setAnimationStep] = useState(0);
  const [isSm, setIsSm] = useState(false);
  const [transformStyle, setTransformStyle] = useState<React.CSSProperties>({});
  const animationInfo = animationCalculation();
  const visibleCases = useMemo(() => cases, [cases]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(15 * itemWidth);

  useEffect(() => {
    console.log(animationStep);
    const handleTransitionEnd = () => {
      console.log("Animation ended, current step: ", animationStep);
      setAnimationStep((prevStep) => prevStep + 1);
    };

    if (carouselRef.current) {
      carouselRef.current.addEventListener("transitionend", handleTransitionEnd);
    }

    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener("transitionend", handleTransitionEnd);
      }
    };
  }, []);

  useEffect(() => {
    if (animationStep === 0 && selector) {
      // First animation
      console.log("Starting first animation", animationInfo.distance + offset);
      setTransformStyle({
        transform: !isSm
          ? `translate3d(-${animationInfo.distance + offset}px, 0px, 0px)`
          : `translate3d(0px, -${animationInfo.distance}px, 0px)`,
        transitionDuration: "6000ms",
      });
    } else if (animationStep === 1) {
      // Second animation
      console.log("Starting second animation");
      setTransformStyle({
        transform: !isSm
          ? `translate3d(${
              animationInfo.tickerOffset + animationInfo.distance + offset
            }px, 0px, 0px)`
          : `translate3d(0px, -${animationInfo.tickerOffset + animationInfo.distance}px, 0px)`,
        transitionDuration: "500ms",
      });
    } else if (animationStep === 2) {
      // Reset animation
      dispatch(toggleDemoClicked());
      setTransformStyle({});
      setAnimationStep(0);
    }
  }, [animationStep, selector]);
  console.log(transformStyle, "rerender");
  return (
    <div className="relative">
      <Image
        src="/icons/down-arrow.svg"
        alt="Arrow Down"
        width={24}
        height={24}
        className={
          "absolute inset-x-0 top-[-10px] z-10 mx-auto transition-colors duration-1000 text-yellow-2 bg-amber-300"
        }
      />
      <div className="mt-md flex overflow-hidden rounded-lg flex-col gap-xs h-[310px] xl:h-[180px]">
        <div className="relative mx-auto my-0 flex h-full items-center justify-center overflow-hidden bg-dark-4 w-full">
          <div
            className="flex transform-gpu will-change-transform carousel-animation"
            // style={selector ? transformStyle : { transform: `translateX(${-1 * offset}px)` }}
            ref={carouselRef}
            style={transformStyle}
          >
            {visibleCases.map((item, index) => (
              <div className={`flex`} key={index}>
                <CarouselItem {...item} key={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
