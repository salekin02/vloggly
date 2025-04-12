// src/components/CreatorProfileView.tsx
"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckmarkBadge01Icon,
  Alert02Icon,
  Location01Icon,
  Link01Icon,
  InstagramIcon,
  NewTwitterIcon,
  Copy01Icon,
  TiktokIcon,
  ArrowLeft01Icon,
  CircleIcon,
} from "hugeicons-react";

import { useCreatorProfile } from "@/hook/useCreatorProfile";
import { queryClient } from "@/providers/query-provider";
import Loading from "@/components/share/common/loading";
import { SiteHeader } from "@/components/share";
import { useChatRoom } from "@/hook/useChatRoom";
import { Label } from "@radix-ui/react-label";

import { CreatorPosts } from "./creator-posts";
import { ActionMenu } from "../massage/actionMenu";

const tabsStyle = {
  boxShadow: "none",
  borderRadius: 0,
  cursor: "pointer",
};
const ActionOptions = [
  { label: "Copy Link Profile", icon: <Copy01Icon size={20} /> },
];
export const CreatorProfileView = () => {
  const params = useParams();
  const username = params.id as string;
  const { profile, isLoading, error } = useCreatorProfile(username);
  const { startChat, loading, error: chatError } = useChatRoom(); // Use the hook

  if (isLoading || !profile?.posts) {
    return <Loading width="598px" />;
  }

  const handleBackArrow = () => {
    window.history.back();
  };
  // useEffect(() => {
  //   window.location.reload();
  // }, [profile]);
  console.log(
    error,
    profile,
    profile?.posts,
    username,
    "data=======================>"
  );
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
    profile &&
    profile?.posts && (
      <div className="pb-20 md:pb-0 bg-white lg:rounded-t-3xl w-[598px] h-full overflow-auto rounded-[20]">
        <div className="block lg:hidden sticky top-0">
          <SiteHeader />
        </div>
        <div className="mb-2 lg:rounded-t-2xl overflow-hidden bg-white">
          <div className="relative max-h-[229px] text-white h-[229px] w-full cursor-pointer ">
            <div className="absolute flex items-center p-4 justify-between w-full bg-gradient-to-b from-[#1d1d1d] to-transparent">
              <div className="flex gap-3 items-center">
                <Button variant="ghost" size="icon" onClick={handleBackArrow}>
                  <ArrowLeft01Icon size={20} />
                </Button>
                <div>
                  <span className="text-base font-medium">{profile.name}</span>
                </div>
              </div>
              <ActionMenu options={ActionOptions} direction="left" id={"1"} />
            </div>
            <Image
              src={profile.profileBanner}
              alt="Banner Image"
              width={640}
              height={229}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex justify-between w-full lg:items-center px-4 cursor-pointer">
            <div className="lg:pt-2.5 lg:pb-5 flex items-center gap-4 relative">
              <div className="absolute -top-10 left-0 border-4 border-white rounded-full">
                <Avatar className="w-25 h-25">
                  <AvatarImage
                    src={profile.profilePicture}
                    alt={profile.name}
                    className="object-cover"
                  />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CircleIcon
                  className="absolute bottom-1 right-1"
                  fill="#32C382"
                  color="#32C382"
                  size={22}
                />
              </div>
              <div className="mt-20 lg:ml-30 lg:mt-0">
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
            <div className="pt-5 lg:p-0">
              <Button
                onClick={() => startChat(profile.userId)}
                disabled={loading}
                className="text-xs rounded-xl font-medium w-22 h-9 flex items-center justify-center"
              >
                {loading ? (
                  // <Loader className="w-4 h-4 animate-spin text-white" />
                  <Loading width="full" />
                ) : (
                  "Chat now"
                )}
              </Button>
              {chatError && <p className="text-red-500 mt-2">{chatError}</p>}
              {/* <Button

                onClick={() => startChat(profile.userId)}
                disabled={loading}
                className="text-xs rounded-xl font-medium w-22 h-9 flex items-center justify-center"
              >
                {loading ? (
                  // <Loader className="w-4 h-4 animate-spin text-white" />
                  <Loading width="full" />
                ) : (
                  "Chat now"
                )}
              </Button>
              {/* {chatError && <p className="text-red-500 mt-2">{chatError}</p>} */}
            </div>
          </div>
        </div>

        {/* Profile info section */}
        <div className="text-sm font-normal break-all text-neutral-800">
          <div className="px-4">
            <span>{profile.bio}</span>
            <div className="py-2.5 space-y-1">
              <div className="flex gap-2 items-center">
                <Location01Icon color="#141B34" size={16} /> <span>LA</span>
              </div>
              <div className="flex gap-2 items-center">
                <Link01Icon color="#141B34" size={16} />{" "}
                <span>https://vloggly.com/{profile.username}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-4 px-4">
            <Button
              variant="outline"
              className="bg-brand-50 rounded-xl text-xs font-medium text-brand-500 border-0"
            >
              <InstagramIcon size={13} strokeWidth="2" /> Instagram
            </Button>
            <Button
              variant="outline"
              className="bg-brand-50 rounded-xl text-xs font-medium text-brand-500 border-0"
            >
              <NewTwitterIcon size={16} strokeWidth="2" /> X
            </Button>
            <Button
              variant="outline"
              className="bg-brand-50 rounded-xl text-xs font-medium text-brand-500 border-0"
            >
              <TiktokIcon size={16} strokeWidth="2" /> Tiktok
            </Button>
          </div>

          <div className="py-5 border-t text-xs font-medium border-b border-border px-4">
            <div className="grid w-full items-center gap-2.5">
              <Label htmlFor="email">Subscription</Label>
              <Button className="w-full bg-brand-500 text-sm font-medium rounded-xl text-left px-4.5 py-2.5 justify-start">
                Subscribe for free
              </Button>
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
              <CreatorPosts
                posts={profile.posts}
                creator={profile}
                viewMode="list"
              />
            </TabsContent>
            <TabsContent value="media">
              <CreatorPosts
                posts={profile.posts}
                creator={profile}
                viewMode="grid"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  );
};
