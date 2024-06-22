import { PeopleOnline } from "./PeopleOnline";

export const ChatHeader = () => {
  return (
    <div className="h-20 top-0 flex-none flex justify-between items-center space-x-1 gradient-border-bottom py-2 px-4 sticky shadow-2xl">
      <div className="flex items-center space-x-2">
        <img src="/icons/chat.svg" alt="avatar" className="w-6 h-6 rounded-full" />
        <span className="text-white text-lg font-semibold">General Chat</span>
      </div>
      <PeopleOnline />
    </div>
  );
};
