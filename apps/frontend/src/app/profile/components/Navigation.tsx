import React, { useState, useEffect } from 'react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navLinks = [
    { name: 'Profile', href: '/profile' },
    { name: 'Stats', href: '/stats' },
    { name: 'Bets', href: '/bets' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (href: string) => {
    setActiveTab(href);
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full mb-4 relative z-30">
      <div className="max-w-4xl mx-auto px-4">
        {isMobile ? (
          <div className="relative">
            <button
              className="text-white text-2xl font-bold py-2 flex items-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              Menu
              <svg
                className={`ml-2 h-6 w-6 transform transition-transform duration-200 ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isMenuOpen && (
              <ul className="absolute top-full left-0 right-0 bg-gray-800 mt-2 rounded-md shadow-lg overflow-hidden">
                {navLinks.map((navLink, index) => (
                  <li
                    key={index}
                    className={`border-b border-gray-700 last:border-b-0 ${
                      activeTab === navLink.href ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => handleNavClick(navLink.href)}
                  >
                    <span
                      className={`block px-4 py-3 text-lg font-bold transition-colors duration-200 ${
                        activeTab === navLink.href
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {navLink.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <ul className="flex justify-between items-center h-full space-x-4">
            {navLinks.map((navLink, index) => (
              <li
                className="relative flex items-center px-4 py-2 group hover:cursor-pointer"
                key={index}
                onClick={() => handleNavClick(navLink.href)}
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
        )}
      </div>
      <div className="border-t border-gray-600 mt-4"></div> 
    </div>
  );
};

export default Navigation;
