import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Search01Icon } from "hugeicons-react";

export const SearchBar = () => {
  return (
    <div className="relative w-full md:flex">
      <div className="relative w-full">
        <Input
          type="search"
          placeholder="Search"
          className="w-full bg-white border-none rounded-full pl-4 pr-10"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full rounded-full"
        >
          <Search01Icon size={20} />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </div>
  );
};
