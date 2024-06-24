export const ChatInput = () => {
  return (
    <div className="flex-none px-4 w-full h-24 flex items-center justify-between z-50 border-t-green-500 gradient-border-top">
      <textarea
        className="bg-dark rounded-lg p-4 text-white w-full h-auto resize-none focus:outline-none focus:ring-2 focus:ring-opacity-50 overflow-hidden"
        placeholder="Enter your text here..."
      ></textarea>
    </div>
  );
};
