import { useEffect, useState } from "react";
import {
  LayoutGridIcon,
  Menu02Icon,
  Search01Icon,
  PlusSignIcon,
} from "hugeicons-react"; // adjust path

type RecentBarProps = {
  tab: string; // "Grid" or something else
};

const RecentBar: React.FC<RecentBarProps> = ({ tab }) => {
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    setIsGridView(tab !== "Grid");
  }, [tab]);

  const toggleView = () => {
    setIsGridView((prev) => !prev);
    // Optionally emit event or callback
  };

  return (
    <div className="w-full flex items-center justify-between border-b px-4 bg-white py-4.5">
      <span className="text-sm font-normal text-neutral-600">Recent</span>
      <div className="flex items-center gap-4">
        <Search01Icon
          size={20}
          color="#969696"
          strokeWidth={2}
          className="cursor-pointer hover:text-brand-600 transition duration-400"
        />

        {isGridView ? (
          <LayoutGridIcon
            size={20}
            color="#969696"
            strokeWidth={2}
            className="cursor-pointer hover:text-brand-600 transition duration-400"
            onClick={toggleView}
          />
        ) : (
          <Menu02Icon
            size={20}
            color="#969696"
            strokeWidth={2}
            className="cursor-pointer hover:text-brand-600 transition duration-400"
            onClick={toggleView}
          />
        )}

        <PlusSignIcon
          size={20}
          color="#969696"
          strokeWidth={2}
          className="cursor-pointer hover:text-brand-600 transition duration-400"
        />
      </div>
    </div>
  );
};

export default RecentBar;
