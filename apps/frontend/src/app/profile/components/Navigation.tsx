import React from 'react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navLinks = [
    { name: 'Profile', href: '/profile' },
    { name: 'Stats', href: '/stats' },
    { name: 'Bets', href: '/bets' },
  ];

  return (
    <div className="w-full mb-4">
      <div className="max-w-4xl mx-auto px-4">
        <ul className="flex justify-between items-center h-full space-x-4">
          {navLinks.map((navLink, index) => (
            <li
              className="relative flex items-center px-4 py-2 group hover:cursor-pointer"
              key={index}
              onClick={() => setActiveTab(navLink.href)}
            >
              <div
                className={`absolute inset-x-0 bottom-0 h-1 rounded-t-md bg-red-500 origin-center ${
                  navLink.href === activeTab
                    ? ""
                    : "transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                }`}
              ></div>
              <span
                className={`text-2xl font-bold text-gray-400 group-hover:text-white duration-75 ${
                  activeTab === navLink.href ? "text-white" : ""
                }`}
              >
                {navLink.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-600 mt-4"></div> 
    </div>
  );
};

export default Navigation;
