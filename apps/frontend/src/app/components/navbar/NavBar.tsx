"use client";

import Link from "next/link";
import { useState } from "react";
import Hamburger from "./Hamburger";
import { CasesIcon, GamesIcon, LeaderboardsIcon, RewardsIcon } from "./NavIcon";

const navLinks = [
  {
    name: "Games",
    icon: GamesIcon,
    href: "/games",
  },
  {
    name: "Rewards",
    icon: RewardsIcon,
    href: "/rewards",
  },
  {
    name: "Leaderboards",
    icon: LeaderboardsIcon,
    href: "/leaderboards",
  },
  {
    name: "Cases",
    icon: CasesIcon,
    href: "/cases",
  },
];

export const NavBar = () => {
  const [navActiveLink, setNavActiveLink] = useState("/cases");
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="text-white top-0 left-0 bg-background w-full border-b-green-400 gradient-border-bottom shadow-2xl sticky z-50 h-20">
      <div className="flex justify-between items-center w-full h-full z-10 px-5">
        <div className="flex items-center justify-between space-x-24 h-full">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gradient">SolSpin</span>
          </div>
          <ul className="hidden space-x-8 lg:flex h-full">
            {navLinks.map((navLink, index) => (
              <li
                className="relative flex items-center space-x-3 group hover:cursor-pointer pr-4"
                key={index}
              >
                <div
                  className={`absolute inset-x-0 bottom-0 h-1 rounded-t-md bg-red-500 origin-center ${
                    navLink.href === navActiveLink
                      ? ""
                      : "transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                  }`}
                ></div>
                <navLink.icon
                  className={`h-6 w-6 text-gray-400 group-hover:text-red-500 duration-75 ${
                    navActiveLink === navLink.href ? "text-red-500" : ""
                  }`}
                />
                <Link onClick={() => setNavActiveLink(navLink.href)} href={navLink.href}>
                  <span
                    className={`text-gray-400 group-hover:text-white duration-75 ${
                      navActiveLink === navLink.href ? "text-white" : ""
                    }`}
                  >
                    {navLink.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex space-x-4 item-center">
          <button className="hidden lg:block bg-custom_gray text-white py-2 px-5 rounded">
            Withdraw
          </button>
          <button className="bg-green-500 text-white py-2 px-5 rounded font-semibold">
            Sign In
          </button>
          <Hamburger className={"lg:hidden"} onClick={() => {}} />
        </div>
      </div>
    </header>
  );
};