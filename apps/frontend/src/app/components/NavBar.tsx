"use client";

import Link from "next/link";
import { useState } from "react";
import Hamburger from "./Hamburger";

const navLinks = [
  {
    name: "Games",
    icon: "/icons/games.svg",
    href: "/",
  },
  {
    name: "Rewards",
    icon: "/icons/rewards.svg",
    href: "/",
  },
  {
    name: "Leaderboards",
    icon: "/icons/leaderboards.svg",
    href: "/",
  },
  {
    name: "Cases",
    icon: "/icons/cases.svg",
    href: "/",
  },
];

export const NavBar = () => {
  const [navActiveLink, setNavActiveLink] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="text-white top-0 left-0 bg-background py-4 px-6 w-full border-b-green-400 gradient-border-bottom shadow-2xl sticky z-50">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center justify-between space-x-24">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gradient">SolSpin</span>
          </div>
          <ul className="hidden space-x-8 lg:flex">
            {navLinks.map((navLink) => (
              <li className="flex items-center space-x-3" key={navLink.name}>
                <img src={navLink.icon} alt={navLink.name} className="h-6 w-6" />
                <Link
                  onClick={() => setNavActiveLink(navLink.name)}
                  href={navLink.href}
                  className={`hover:text-green-300 text-transition-custom ${
                    navActiveLink === navLink.name ? "gradient-text" : ""
                  }`}
                >
                  {navLink.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex space-x-4 item-center">
          <button className="hidden lg:block bg-custom_gray text-white py-2 px-5 rounded">
            Withdraw
          </button>
          <button className="sign-in-button text-black py-2 px-5 rounded">Sign In</button>
          <Hamburger className={"lg:hidden"} onClick={() => {}} />
        </div>
      </div>
    </header>
  );
};
