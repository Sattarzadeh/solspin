import Image from "next/image";

export const CaseItem = () => {
  return (
    <div className="flex items-center w-full rounded-sm space-x-2 p-4 main-element overflow-hidden">
      <div
        className="relative flex flex-col items-center justify-center border-black border-[1px] rounded-sm"
        style={{ width: 125, height: 125 }}
      >
        <div className="relative flex justify-center items-center h-full w-full">
          <Image src={"/cases/gun.svg"} alt={"case"} width={125} height={125} />
        </div>
        <div
          className="absolute bottom-0 right-0 w-full h-1/3 opacity-20"
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
      <div className="flex flex-col justify-center items-start space-y-1">
        <span className="text-white text-sm">Watson Power</span>
        <span className="text-white text-sm">Extrodinary</span>
        <span className="text-white text-sm">$4.99</span>
        <div className="rounded-md bg-dark p-1">
          <span className="text-white text-xs">2.5%</span>
        </div>
      </div>
    </div>
  );
};
