import { LeftSidebar } from "@/components/share/common/left-sidebar";
import { MobileBar } from "@/components/share/home-pages/mobile-bottom-bar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Message | Vloggly",
};
export default function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex justify-center w-full">
        <div className="h-screen max-w-[1440px] w-full overflow-hidden gap-4 lg:py-10 lg:px-5">
          <div className="flex h-full gap-4 justify-center">
            <LeftSidebar />
            {children}
            <div className="fixed bottom-0 left-0 right-0 w-full z-50 block lg:hidden">
              <MobileBar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
