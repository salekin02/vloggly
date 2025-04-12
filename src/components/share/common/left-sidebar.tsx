"use client";
import { Button } from "@/components/ui/button";

import {
  Home01Icon,
  Notification03Icon,
  Bookmark02Icon,
  UserIcon,
  CreditCardIcon,
  Diamond02Icon,
  Mail01Icon,
  MoreHorizontalCircle01Icon,
  PlusSignIcon,
} from "hugeicons-react";
import { SidebarNavItem } from "@/components/share/home-pages/sidebar-navItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { useAuthStore } from "@/data";
import { useRef, useState, useLayoutEffect } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ProfileBar } from "./profile-bar";
import { useUserProfile } from "@/hook/useUsers";

export const LeftSidebar = () => {
  // const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const { profile } = useUserProfile();

  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // cordinates tracking for diaglue
  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      setCoords({
        top: rect.bottom + scrollTop + 8 - 245,
        left: rect.left + scrollLeft + 147,
      });
    }
  }, [open]);

  return (
    <div className="w-[325px] hidden lg:block">
      <div className="w-[325px] border border-border bg-white p-4 rounded-[20]">
        <div className="mb-6">
          <Avatar
            className="size-9 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <AvatarImage
              width={40}
              height={40}
              className="rounded-[50]"
              src={profile?.profilePicture}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <nav className="space-y-1">
          <SidebarNavItem path="/home">
            <Home01Icon className="mr-3 h-5 w-5" size={20} />
            <span className="font-medium text-sm">Home</span>
          </SidebarNavItem>

          <SidebarNavItem path="/notification">
            <Notification03Icon className="mr-3 h-5 w-5" size={20} />
            <span className="font-medium text-sm">Notification</span>
          </SidebarNavItem>

          <SidebarNavItem path="/messages">
            <Mail01Icon className="mr-3 h-5 w-5" size={20} />
            <span className="font-medium text-sm">Message</span>
          </SidebarNavItem>

          <SidebarNavItem path="/collection">
            <Bookmark02Icon className="mr-3 h-5 w-5" size={20} />
            <span className="font-medium text-sm">Collection</span>
          </SidebarNavItem>

          <SidebarNavItem path="/subscription">
            <Diamond02Icon className="mr-3 h-5 w-5" size={20} />
            <span className="font-medium text-sm">Subscriptions</span>
          </SidebarNavItem>

          <SidebarNavItem path="/card">
            <CreditCardIcon className="mr-3 h-5 w-5" size={20} />
            <span className="font-medium text-sm">Card</span>
          </SidebarNavItem>

          <SidebarNavItem path={`/my-profile/${profile?.username}`}>
            <UserIcon className="mr-3 h-5 w-5" size={20} />
            <span className="font-medium text-sm">My Profile</span>
          </SidebarNavItem>

          {/* More options  */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTitle className="hidden"></DialogTitle>

            <DialogTrigger asChild>
              <div
                onClick={() => setOpen(true)}
                className="flex items-center rounded-md p-3 hover:bg-[#f0f0f0] cursor-pointer"
                ref={triggerRef}
              >
                <MoreHorizontalCircle01Icon
                  className="mr-3 h-5 w-5"
                  fill="#000000"
                />
                <span className="font-medium text-sm">More</span>
              </div>
            </DialogTrigger>

            <DialogContent
              className="w-[325px] p-2 border-none shadow-xl rounded-xl z-[9999]"
              style={{
                top: `${coords.top}px`,
                left: `${coords.left}px`,
              }}
            >
              <DialogTitle asChild className="hidden"></DialogTitle>
              {/* nav options  */}
              <ProfileBar onOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </nav>
      </div>
      <div className="mt-4">
        <Button className="w-full rounded-full py-2.5 font-medium">
          <PlusSignIcon style={{ strokeWidth: 3, height: 14, width: 14 }} />
          New Post
        </Button>
      </div>
    </div>
  );
};
