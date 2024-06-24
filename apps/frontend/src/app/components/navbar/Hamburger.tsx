import React, { useState } from "react";

interface HamburgerButtonProps {
  className: string;
  onClick: () => void;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ className, onClick }) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
    onClick();
  };

  return (
    <button
      className={`text-white w-10 h-10 relative focus:outline-none bg-custom_gray rounded-md ${className}`}
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
  );
};

export default HamburgerButton;
