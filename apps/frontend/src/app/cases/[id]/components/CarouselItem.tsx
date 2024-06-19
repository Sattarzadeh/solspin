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
      className="relative flex flex-col items-center justify-center"
      style={{ width: 176, height: 176 }}
    >
      <div className="absolute top-0 left-0 h-full w-full">
        <Image
          src={image}
          alt={"case"}
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
