"use client";

import { LeftSidebar } from "@/components/share/common/left-sidebar";
import { MobileBar } from "@/components/share/home-pages/mobile-bottom-bar";
import { RightSidebar } from "@/components/share";
import { useAuthStore } from "@/data";
import { usePathname } from "next/navigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const isCardPage = pathname.includes("/card");
  return (
    <>
      {/* <div className=" flex justify-center">
        <div className="max-w-[1440px] w-full lg:px-20 lg:py-10 lg:bg-[#f7f7f7]">
          Left Sidebar - 325px in design
          <div className="grid grid-cols-1 lg:grid-cols-[325px_minmax(939px,_1fr)] gap-4">
            <div className="lg:sticky lg:top-0 hidden lg:block">
              <LeftSidebar />
            </div>
            <div className="overflow-auto">{children}</div>
          </div>
          <div className="fixed bottom-0 w-full z-50 block lg:hidden">
            <MobileBar />
          </div>
        </div>
      </div> */}

      <div className="lg:flex justify-center ">
        <div className="h-screen max-w-[1440px] overflow-x-hidden gap-4 lg:py-10 lg:px-5">
          <div className="flex h-full gap-4">
            {(isAuthenticated || isCardPage) && <LeftSidebar />}
            {children}
            {isAuthenticated && <RightSidebar />}
            <div className="fixed bottom-0 left-0 right-0 w-full z-50 block lg:hidden">
              <MobileBar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
