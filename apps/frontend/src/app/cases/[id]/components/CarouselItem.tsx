import Image from "next/image";

export const CarouselItem = () => {
  return (
    <div className="relative h-32 w-32 flex-shrink-0 min-w-0">
      <div className="absolute top-0 left-0 h-full w-full">
        <Image
          src={"/cases/gun.svg"}
          alt={"gun"}
          objectFit="contain"
          className="object-contain"
          width={176}
          height={176}
        />
        <div
          className="absolute top-0 right-0 w-full h-full opacity-20"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgb(235, 76, 75) 0%, rgba(74, 34, 34, 0) 100%)",
          }}
        ></div>
      </div>
    </div>
  );
};
