import { TimeLine } from "@/components/share";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Vloggly",
};

const HomePage = () => {
  return (
    <>
      {/* <div className="grid grid-cols-1 md:grid-cols-[minmax(598px,_2fr)_minmax(325px,_1fr)] gap-4 h-full">
        <div className="overflow-y-auto max-h-[calc(100vh-40px)] lg:rounded-[20] border border-border">
          <div className="block lg:hidden sticky top-0">
            <SiteHeader />
          </div>
          <TimeLine />
        </div>
        <div className="sticky top-0 self-start h-fit hidden md:block">
          <RightSidebar />
        </div>
      </div> */}

      <TimeLine />
    </>
  );
};

export default HomePage;
