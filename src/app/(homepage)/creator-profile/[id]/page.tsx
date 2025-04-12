import { CreatorProfileView } from "@/components/share/creator-profile-view/creator-profile-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator Profile | Vloggly",
};

export default function CreatorProfilePage() {
  return (
    // <div className="grid grid-cols-1 md:grid-cols-[minmax(598px,_2fr)_minmax(325px,_1fr)] gap-4 h-full">
    //   <div className="overflow-y-auto max-h-[calc(100vh-40px)]">
    //     <div className="block lg:hidden sticky top-0">
    //       <SiteHeader />
    //     </div>
    <CreatorProfileView />
    //   </div>
    //   <div className="sticky top-0 self-start h-full">
    //     <RightSidebar />
    //   </div>
    // </div>
  );
}
