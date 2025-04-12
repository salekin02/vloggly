"use client";

import Link from "next/link";
import { SearchBar } from "../../common/searchBar";
import { ProfileCard } from "./profile-card";
import { useSuggestedCreators } from "@/hook/useSuggestedCreators";
import { Alert02Icon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/share/common/loading";
import { usePathname } from "next/navigation";

export const RightSidebar = () => {
  const { suggestedCreators, isLoading, error, refetch } =
    useSuggestedCreators(4);

  /** if current route starts with /card then do not render this element, get current route to identify */

  const pathname = usePathname();
  if (pathname.startsWith("/card")) {
    return null;
  }

  // Map suggestedCreators to ProfileCard props, keeping userId as string
  const profiles = suggestedCreators.map((creator) => ({
    id: creator.userId,
    name: creator.name,
    username: `${creator.username}`,
    profileBanner: creator.profileBanner || "/assets/images/cover1.png", // Fallback
    profileImage: creator.profilePicture || "/assets/images/default-user.png", // Fallback
    verified: true, // Static assumption
    free: true, // Static assumption
  }));

  if (error || !suggestedCreators) {
    return (
      <div className="flex justify-center h-full overflow-auto items-center animate-fade-in w-[325px] hidden lg:flex">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md mx-4">
          <Alert02Icon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Oops, something went wrong
          </h2>
          <p className="text-neutral-600 mb-4">
            {error?.message ||
              "We couldn’t load suggested accounts. Please try again."}
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[325px] flex flex-col h-full overflow-auto lg:flex self-start hidden lg:flex">
      {/* Search Bar */}
      <SearchBar />
      <span className="text-base font-medium my-4">Suggested Account</span>
      {isLoading ? (
        <Loading width="325px" />
      ) : (
        <main className="container max-w-md mx-auto">
          {profiles.map((profile, index) => (
            <Link key={index} href={`/creator-profile/${profile.username}`}>
              <ProfileCard key={profile.id} profile={profile} />
            </Link>
          ))}
        </main>
      )}

      <footer className="py-6 px-2 border-t border-[#151515]/10">
        <div className="container flex items-center flex-wrap justify-center gap-4 text-[#545454] whitespace-nowrap">
          <Link href="#" className="text-[12px] hover:underline">
            Privacy
          </Link>
          <span className=" text-[8px]">●</span>
          <Link href="#" className="text-[12px] hover:underline">
            Cookie Notice
          </Link>
          <span className="text-[8px]">●</span>
          <Link href="#" className="text-[12px] hover:underline">
            Terms of service
          </Link>
        </div>
      </footer>
    </div>
  );
};
