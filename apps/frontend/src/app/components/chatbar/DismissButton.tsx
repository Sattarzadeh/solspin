import Image from "next/image";

interface DismissButtonProps {
  toggleChatClose: () => void;
}

export const DismissButton: React.FC<DismissButtonProps> = ({ toggleChatClose }) => {
  return (
    <button
      className="flex justify-center items-center bg-gray-800 rounded-md w-8 h-8 p-1 z-20 hover:cursor-pointer shadow-circle hover:bg-gray-700 transition-all duration-250 ease-in-out"
      onClick={() => {
        toggleChatClose();
      }}
    >
      <Image
        width={24}
        height={24}
        src={"/icons/close-left.svg"}
        alt={"close"}
        className={"filter-white"}
      />
    </button>
  );
};
