export const Search = () => {
  return (
    <div className="flex justify-start items-center bg-search_bar_gray px-4 py-2 rounded-md h-10 space-x-2">
      <img src="/icons/magnifying_glass.svg" alt="search" className="h-3.5 w-3.5" />
      <input
        type="text"
        placeholder="Search"
        className="bg-search_bar_gray h-8 text-white active:border-none outline-none"
      />
    </div>
  );
};
