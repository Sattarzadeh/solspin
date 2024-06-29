import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';

interface UserProfileProps {
  username: string;
  profilePictureURL?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  username,
  profilePictureURL
}) => {
  const { connected } = useWallet();

  if (!connected) {
    return null;
  }

  // Truncate the username if it's too long
  const maxUsernameLength = 10;
  const truncatedUsername = username.length > maxUsernameLength ? username.slice(0, maxUsernameLength) + '...' : username;

  return (
    <div className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer">
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image
          src={profilePictureURL || "/../../../../header-image.png"}
          alt=""
          layout="fill"
          objectFit="cover"
        />
      </div>
      <span className="text-white font-medium hidden sm:inline">{truncatedUsername}</span>
    </div>
  );
};
