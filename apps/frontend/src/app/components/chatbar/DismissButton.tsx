import { useDispatch } from "react-redux";
import { toggleChatBarClicked } from "../../../store/slices/chatBarSlice";

export const DismissButton = () => {
  const dispatch = useDispatch();

  return (
    <button
      className="p-1.5 bg-gray-900 rounded-lg w-8 h-8 z-20"
      onClick={() => dispatch(toggleChatBarClicked())}
    >
      <img src="/icons/close-left.svg" alt="close" className="w-5 h-5" />
    </button>
  );
};
