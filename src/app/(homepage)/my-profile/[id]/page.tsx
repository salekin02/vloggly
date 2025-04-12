"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckmarkBadge01Icon,
  Location01Icon,
  Link01Icon,
  InstagramIcon,
  NewTwitterIcon,
  Copy01Icon,
  TiktokIcon,
  ArrowLeft01Icon,
} from "hugeicons-react";

import { queryClient } from "@/providers/query-provider";
import Loading from "@/components/share/common/loading";
import { Error } from "@/components/share/common/error";
import { SiteHeader } from "@/components/share";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { ActionMenu } from "../../../../components/share/massage/actionMenu";
import EditProfileModal from "@/components/share/my-profile/edit-profile";
import { useUserProfile } from "@/hook/useUsers";

const tabsStyle = {
  boxShadow: "none",
  borderRadius: 0,
  cursor: "pointer",
};

const ActionOptions = [
  { label: "Copy Link Profile", icon: <Copy01Icon size={20} /> },
];
export default function CreatorProfileView() {
  const params = useParams();
  const username = params.id as string;
  const { profile, isLoading, error } = useUserProfile();

  if (isLoading) return <div>Loading...</div>;

  if (isLoading) {
    return <Loading width="598px" />;
  }

  const handleBackArrow = () => {
    window.history.back();
  };

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center h-screen animate-fade-in w-[598px]">
        <div className="text-center">
          <Error width="598px" />
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
    profile && (
      <div className="bg-white lg:rounded-t-3xl w-[598px] h-full overflow-auto rounded-[20]">
        <div className="block lg:hidden sticky top-0">
          <SiteHeader />
        </div>
        <div className="mb-4 lg:rounded-t-2xl overflow-hidden bg-white">
          <div className="relative max-h-[229px] text-white h-[229px] w-full cursor-pointer ">
            <div className="absolute flex items-center p-4 justify-between w-full bg-gradient-to-b from-[#1d1d1d] to-transparent">
              <div className="flex gap-3 items-center">
                <div>
                  <ArrowLeft01Icon
                    className="cursor-pointer"
                    onClick={handleBackArrow}
                    size={20}
                  />
                </div>
                <div>
                  <span className="text-base font-medium">{profile.name}</span>
                </div>
              </div>
              <ActionMenu options={ActionOptions} direction="left" id={"1"} />
            </div>
            <Image
              src={profile.profileBanner || "/default-banner.jpg"}
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
                  @{profile.username} <span className="mx-2 text-xs">●</span>
                  <span>Available now</span>
                </p>
              </div>
            </div>
            <div>
              {/* herre  */}
              <EditProfileModal {...profile} />
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
            <a
              href={
                profile?.socialMediaLink?.instagram ||
                "https://www.instagram.com"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="bg-brand-50 text-brand-500 border-0"
              >
                <InstagramIcon size={13} strokeWidth="2" /> Instagram
              </Button>
            </a>
            <a
              href={profile?.socialMediaLink?.x || "https://www.twitter.com"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="bg-brand-50 text-brand-500 border-0"
              >
                <NewTwitterIcon size={16} strokeWidth="2" /> X
              </Button>
            </a>
            <a
              href={
                profile?.socialMediaLink?.tiktok || "https://www.tiktok.com"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="bg-brand-50 text-brand-500 border-0"
              >
                <TiktokIcon size={16} strokeWidth="2" /> Tiktok
              </Button>
            </a>
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
        </div>

        {/* Posts */}
        <div
          className={`bg-[#f7f7f7] border-border ${profile?.posts?.length > 0 ? "h-screen" : "h-fit"}`}
        >
          <Tabs defaultValue="posts" className="w-full gap-[2px]">
            <TabsList className="grid w-full h-full pb-0 grid-cols-2 bg-white rounded-none">
              <TabsTrigger
                value="posts"
                style={tabsStyle}
                className="p-4 transition delay-100 duration-300 ease-in-out"
              >
                {profile?.posts?.length} Posts
              </TabsTrigger>
              <TabsTrigger
                value="media"
                style={tabsStyle}
                className="p-4 transition delay-100 duration-300 ease-in-out"
              >
                {
                  profile?.posts?.filter((post) => post?.media?.length > 0)
                    .length
                }{" "}
                Media
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              {/* <CreatorPosts
                posts={profile.posts}
                creator={profile}
                viewMode="list"
              /> */}
            </TabsContent>
            <TabsContent value="media">
              {/* <CreatorPosts
                posts={profile.posts}
                creator={profile}
                viewMode="grid"
              /> */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  );
}
