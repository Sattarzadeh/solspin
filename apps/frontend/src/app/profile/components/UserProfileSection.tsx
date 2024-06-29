import { UserHeading } from './UserHeading';
import UserInfoSection from './UserProfile';

export const UserProfileSection: React.FC = () => {
  const userProfileData = {
    username: 'melz123',
    profilePictureURL: '/path/to/profile-picture.jpg',
    rank: 'Unranked',
    progress: '40'
  };

  return (
    <div className="min-h-screen p-4">
      <UserHeading {...userProfileData} />
      <UserInfoSection username={'wadwadawdaw'} />
    </div>
  );
};

