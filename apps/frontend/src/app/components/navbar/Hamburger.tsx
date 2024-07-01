import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface HamburgerButtonProps {
  className: string;
}

interface MenuOption {
  label: string;
  onClick: () => void;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggleOpen = () => {
    setOpen(!open);
  };

  const menuOptions: MenuOption[] = [
    { label: "Cases", onClick: () => router.push("/cases") },
    { label: "Rewards", onClick: () => router.push("/rewards") },
    { label: "Leaderboards", onClick: () => router.push("/leaderboards") },
    { label: "Withdraw", onClick: () => console.log("Contact clicked") },
  ];

  return (
    <div className="relative">
      <button
        className={`text-white w-12 h-12 relative focus:outline-none bg-custom_gray rounded-md ${className}`}
        onClick={toggleOpen}
      >
        <span className="sr-only">Open main menu</span>
        <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span
            aria-hidden="true"
            className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
              open ? "rotate-45" : "-translate-y-1.5"
            }`}
          ></span>
          <span
            aria-hidden="true"
            className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
              open ? "opacity-0" : ""
            }`}
          ></span>
          <span
            aria-hidden="true"
            className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
              open ? "-rotate-45" : "translate-y-1.5"
            }`}
          ></span>
        </div>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-custom_gray shadow-lg lg:hidden rounded-b-md">
          {menuOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                option.onClick();
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 last:rounded-b-md"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HamburgerButton;
