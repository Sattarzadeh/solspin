import { PeopleOnline } from "./PeopleOnline";
import { DismissButton } from "./DismissButton";

export const ChatHeader = () => {
  return (
    <div className="h-16 flex justify-between items-center space-x-1 gradient-border-bottom p-2">
      <div className="flex items-center space-x-2">
        <img src="/icons/chat.svg" alt="avatar" className="w-6 h-6 rounded-full" />
        <span className="text-white text-lg font-semibold">General Chat</span>
      </div>
      <div className="flex items-center space-x-2">
        <PeopleOnline />
        <DismissButton />
      </div>
    </div>
  );
};
