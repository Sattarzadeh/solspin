import Image from "next/image";

export const ChatInputElement = () => {
  return (
    <div className="relative py-4 px-2 gradient-border-bottom">
      <div className="flex items-center justify-between space-x-2">
        <Image src="/cases/dota_3.svg" alt="Profile picture" width={48} height={48} />
        <div className="flex flex-col space-y-1.5 justify-between items-start">
          <span className="gradient-text text-sm font-bold">Jacob Jones (You)</span>
          <p className="text-gray-300 text-xs">Is anyone participating in the lootbox weekend?</p>
          <span className="text-gray-600 text-2xs">4 mins ago</span>
        </div>
      </div>
    </div>
  );
};
