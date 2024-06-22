import Image from "next/image";

interface CarouselItemProps {
  name: string;
  price: number;
  rarity: string;
  tag: string;
  image: string;
}

export const CarouselItem: React.FC<CarouselItemProps> = ({ name, price, rarity, tag, image }) => {
  return (
    <div
      className="relative flex flex-col items-center justify-center border-[1px] border-black"
      style={{ width: 176, height: 176 }}
    >
      <div className="relative flex justify-center items-center h-full w-full">
        <Image src={image} alt={"case"} width={140} height={140} />
      </div>
      <div
        className="absolute top-0 right-0 w-full h-full opacity-30 z-[-1]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgb(235, 76, 75) 0%, rgba(74, 34, 34, 0) 100%)",
        }}
      ></div>
      <div
        className="absolute bottom-2 w-3/4 h-0.5"
        style={{
          backgroundColor: "rgb(235, 76, 75)",
          boxShadow: "0px 0px 10px 2px rgba(235, 76, 75, 0.75)",
        }}
      ></div>
    </div>
  );
};
