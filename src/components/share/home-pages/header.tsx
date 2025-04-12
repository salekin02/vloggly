"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search01Icon, MoreVerticalIcon } from "hugeicons-react";
import Link from "next/link";

export const SiteHeader = () => {
  return (
    <header className="w-full bg-white px-4 border-b border-border z-200">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-[Agbalumo] text-xl bg-gradient-to-r from-[#0073E6] to-[#0059B3] text-transparent bg-clip-text">
            Vloggly
          </span>
        </Link>

        {/* Search Bar */}
        <div className="relative max-w-md w-full hidden md:flex mx-4">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search"
              className="w-full bg-[#f2f2f2] border-none rounded-full pl-4 pr-10 h-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full rounded-full"
            >
              <Search01Icon className="size-5" size={20} />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>

        {/* Right Side - Language & Profile */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex gap-2">
            <Search01Icon size={20} />
            <MoreVerticalIcon size={20} />
          </div>

          {/* User Profile */}
        </div>
      </div>
    </header>
  );
};
