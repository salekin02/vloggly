"use client";

import {
  Home04Icon,
  Notification03Icon,
  PlusSignSquareIcon,
  Mail01Icon,
} from "hugeicons-react";
import { BottomNavItem } from "../common/bottom-navbar-items";
import Image from "next/image";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

import { useState } from "react";
import { ProfileBar } from "../common/profile-bar";

export const MobileBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="flex items-center justify-between gap-6 py-4 px-6 bg-white border-t shadow-sm">
      {/* Home Icon */}
      <BottomNavItem path={"/home"}>
        <Home04Icon className={`w-6 h-6`} />
      </BottomNavItem>

      <BottomNavItem path={"/notification"}>
        <Notification03Icon className="w-6 h-6" />
      </BottomNavItem>

      <BottomNavItem path={"#"}>
        <PlusSignSquareIcon className="w-6 h-6" />
      </BottomNavItem>

      <BottomNavItem path={"/messages"}>
        <Mail01Icon className="w-6 h-6" />
      </BottomNavItem>
      {/* Messages Icon (Active State) */}

      {/* Profile Avatar */}
      <button
        className="w-8 h-8 rounded-full overflow-hidden"
        onClick={() => setDrawerOpen(true)}
      >
        <div className="h-10 w-10 overflow-hidden rounded-full">
          <Image
            width={24}
            height={24}
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Jeniferr Hills"
            className="h-full w-full object-cover"
          />
        </div>
      </button>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        {/* Sheet trigger button – replace this with profile icon if needed */}

        <SheetContent side="right" className="w-[270px]">
          <SheetTitle className="hidden">User Menu</SheetTitle>

          {/* User info */}
          <div className="flex items-center gap-3 px-3 pt-3">
            <div className="h-10 w-10 overflow-hidden rounded-full">
              <Image
                width={24}
                height={24}
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Jeniferr Hills"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">dada asddas</p>
              <p className="text-muted-foreground text-sm">@u458410521</p>
            </div>
          </div>
          <ProfileBar onOpen={setDrawerOpen} />
          {/* Navigation */}
        </SheetContent>
      </Sheet>
    </div>
  );
};
