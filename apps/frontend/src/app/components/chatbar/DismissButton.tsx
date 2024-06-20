interface DismissButtonProps {
  toggleChatOpen: () => void;
}

export const DismissButton: React.FC<DismissButtonProps> = ({ toggleChatOpen }) => {
  return (
    <button
      className="p-1.5 bg-gray-900 rounded-lg w-8 h-8 z-20"
      onClick={() => {
        toggleChatOpen();
      }}
    >
      <img src="/icons/close-left.svg" alt="close" className="w-5 h-5" />
    </button>
  );
};
