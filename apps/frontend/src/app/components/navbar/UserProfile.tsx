import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import Link from 'next/link';

interface UserProfileProps {
  username: string;
  profilePictureURL?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  username,
  profilePictureURL
}) => {
  const { connected, disconnect } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!connected) {
    return null;
  }

  // Truncate the username if it's too long
  const maxUsernameLength = 10;
  const truncatedUsername = username.length > maxUsernameLength ? username.slice(0, maxUsernameLength) + '...' : username;

  const handleLogout = async () => {
    try {
      await disconnect();
      console.log('Disconnected from wallet');
      // You can add additional logic here, such as redirecting to a home page
      // or clearing any user-specific data from your app's state
    } catch (error) {
      console.error('Error during logout:', error);
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={profilePictureURL || "/header-image.png"}
            alt=""
            layout="fill"
            objectFit="cover"
          />
        </div>
        <span className="text-white font-medium hidden sm:inline">{truncatedUsername}</span>
      </div>
      
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1 z-50">
          <Link href="/profile" className="block px-4 py-2 text-sm text-white-700 hover:bg-gray-800">
              Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-white-700 hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
