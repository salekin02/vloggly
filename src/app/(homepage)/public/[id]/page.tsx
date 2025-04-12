// src/components/CreatorProfileView.tsx
"use client";

// Removing metadata export since it's now in layout.tsx
// import type { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "Public | Vloggly",
// };

import Image from "next/image";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  CheckmarkBadge01Icon,
  Alert02Icon,
  Location01Icon,
  Link01Icon,
  InstagramIcon,
  NewTwitterIcon,
  TiktokIcon,
} from "hugeicons-react";

import { useCreatorpublic } from "@/hook/useCreatorProfile";
import { queryClient } from "@/providers/query-provider";
import Loading from "@/components/share/common/loading";
import { SiteHeader } from "@/components/share";
import { useChatRoom } from "@/hook/useChatRoom";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
export default function Public() {
  const params = useParams();
  const username = params.id as string;
  const { profile, isLoading, error } = useCreatorpublic(username);
  const { startChat, loading, error: chatError } = useChatRoom(); // Use the hook
  const router = useRouter();

  if (isLoading) {
    return <Loading width="598px" />;
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center h-screen animate-fade-in w-[598px]">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md mx-4">
          <Alert02Icon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Oops, something went wrong
          </h2>
          <p className="text-neutral-600 mb-4">
            {error?.message ||
              "We couldn’t load the profile. Please try again."}
          </p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["creatorProfile", username],
              })
            }
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white lg:rounded-t-3xl w-[598px] h-full overflow-auto rounded-[20]">
      <div className="block lg:hidden sticky top-0">
        <SiteHeader />
      </div>
      <div className="mb-4 lg:rounded-t-2xl overflow-hidden bg-white">
        <div className="relative max-h-[229px] h-[229px] w-full cursor-pointer">
          <Image
            src={profile.profileBanner}
            alt="Banner Image"
            width={640}
            height={229}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex justify-between w-full items-center px-4 cursor-pointer">
          <div className="pt-2.5 pb-5 flex items-center gap-4 relative">
            <div className="absolute -top-10 left-0 border-4 border-white rounded-full">
              <Avatar className="w-25 h-25">
                <AvatarImage
                  src={profile.profilePicture}
                  alt={profile.name}
                  className="object-cover"
                />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-30">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">{profile.name}</h3>
                <CheckmarkBadge01Icon className="h-5 w-5 fill-[#0073e6] text-white" />
              </div>
              <p className="text-[#545454] text-sm font-normal">
                @{profile.username} <span className="mx-2">●</span>
                <span>Available now</span>
              </p>
            </div>
          </div>
          <div>
            <Button
              onClick={() => startChat(profile.userId)} // Use hook with creatorId
              disabled={loading}
            >
              {loading ? "Starting Chat..." : "Message"}
            </Button>
            {chatError && <p className="text-red-500 mt-2">{chatError}</p>}
          </div>
        </div>
      </div>

      {/* Profile info section */}
      <div className="text-sm font-normal text-neutral-800">
        <div className="px-4">
          <span>{profile.bio}</span>
          <div className="py-2.5 space-y-1">
            <div className="flex gap-2 items-center">
              <Location01Icon color="#141B34" size={16} /> <span>LA</span>
            </div>
            <div className="flex gap-2 items-center">
              <Link01Icon color="#141B34" size={16} />{" "}
              <span>https://endast.com/{profile.username}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4 px-4">
          <Button
            variant="outline"
            className="bg-brand-50 text-brand-500 border-0"
          >
            <InstagramIcon size={13} strokeWidth="2" /> Instagram
          </Button>
          <Button
            variant="outline"
            className="bg-brand-50 text-brand-500 border-0"
          >
            <NewTwitterIcon size={16} strokeWidth="2" /> X
          </Button>
          <Button
            variant="outline"
            className="bg-brand-50 text-brand-500 border-0"
          >
            <TiktokIcon size={16} strokeWidth="2" /> Tiktok
          </Button>
        </div>

        <div className="py-5 border-t border-b border-border px-4">
          <div className="grid w-full items-center gap-2.5">
            <Label htmlFor="email">Subscription</Label>
            <Input
              type="text"
              defaultValue="Subscribed"
              disabled
              className="rounded-[10px] bg-gray-100 text-black px-4 border-none w-full"
            />
          </div>
        </div>

        <div className="w-full h-37 flex justify-center items-center">
          <Button
            onClick={() =>
              router.push(`/sign-in?redirect=/creator-profile/${username}`)
            }
          >
            Login to see the posts
          </Button>
        </div>
      </div>
    </div>
  );
}
