// src/components/TimeLine.tsx
"use client";

import Image from "next/image";
import {
  ThumbsUpIcon,
  Message01Icon,
  Bookmark02Icon,
  MoreHorizontalCircle01Icon,
  CheckmarkBadge02Icon,
} from "hugeicons-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCreation } from "@/components/share/home-pages/post-creation";
import { useTimeline } from "@/hook/useTimeline";
import { useUserProfile } from "@/hook/useUsers";
import { useLightboxStore, useProfileStore } from "@/data";
import { SiteHeader } from "@/components/share";
import Loading from "@/components/share/common/loading";
import { Error } from "@/components/share/common/error";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { formatPostTime } from "@/lib/utils";
// import { SendGift } from "../massage/massageInput/sendGiftModal";
// import { CreatorProfile, Post } from "@/types";
// import { toast } from "sonner";

const tabsStyle = {
  boxShadow: "none",
  borderRadius: 0,
  margin: "0 auto",
  cursor: "pointer",
};

export const TimeLine = () => {
  const { isLiked, setIsLiked, isCommented, setIsCommented } =
    useProfileStore();
  const { posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTimeline(10);

  const { profile, error, refetch } = useUserProfile();
  const { ref, inView } = useInView();
  const { openLightbox } = useLightboxStore();
  // const [isSendGift, setIsSendGift] = useState(false);
  // const [currentGiftingTo, setCurrentGiftingTo] = useState<CreatorProfile>();

  const handleLightbox = (image?: string, index?: number) => {
    if (image) {
      openLightbox(image);
    }
    if (index !== undefined) {
      const imageArray = posts[index].media.map((media) => media.url);
      console.log(imageArray);
      openLightbox(imageArray);
    }
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <Loading width={"598px"} />;
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Error width={"598px"} />
        <Button
          onClick={() => refetch()}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
        >
          Retry
        </Button>
      </div>
    );
  }

  // const handleSendGift = (post: Post) => {
  //   if (!post?.creator) return;
  //   setCurrentGiftingTo(post.creator as CreatorProfile);
  //   setIsSendGift(true);
  // };

  // const handleTipSuccess = () => {
  //   setCurrentGiftingTo(undefined);
  //   toast.success("Gift sent successfully.");
  // };

  return (
    <div className="bg-[#f7f7f7] w-[598px] h-full overflow-auto lg:rounded-[20]">
      <div className="block lg:hidden sticky top-0">
        <SiteHeader />
      </div>
      <Tabs defaultValue="account" className="w-full gap-[2px]">
        <TabsList className="grid w-full h-full pb-0 grid-cols-2 bg-white rounded-none lg:rounded-tl-[20] lg:rounded-tr-[20] rounded-bl-none rounded-br-none">
          <TabsTrigger
            value="account"
            style={tabsStyle}
            className="p-4 transition delay-100 duration-300 ease-in-out"
          >
            For you
          </TabsTrigger>
          <TabsTrigger
            value="password"
            style={tabsStyle}
            className="p-4 transition delay-100 duration-300 ease-in-out"
          >
            Subscription
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <PostCreation
            creator={{
              ...profile,
              userId: profile._id, // Map 'id' to 'userId'
              posts: [], // Provide an empty array or fetch posts if available
            }}
          />
        </TabsContent>
        <TabsContent value="password">
          <PostCreation
            creator={{
              ...profile,
              userId: profile._id, // Map 'id' to 'userId'
              posts: [], // Provide an empty array or fetch posts if available
            }}
          />
        </TabsContent>
      </Tabs>
      {/* <SendGift
        open={isSendGift}
        setOpen={setIsSendGift}
        creator={currentGiftingTo}
        onSuccess={handleTipSuccess}
      /> */}

      {/* <SendGift
        open={isSendGift}
        setOpen={setIsSendGift}
        onSuccess={handleTipSuccess}
        creatorId={currentGiftingTo?.userId || ""}
        roomId={""}
      /> */}

      <div className="space-y-1">
        {isLoading ? (
          <Loading width="598px" />
        ) : (
          posts.map((post, index) => (
            <div key={post.postId} className="bg-white">
              <div className="mb-3 flex justify-between px-4 pt-4">
                <Link href={`/creator-profile/${post.creator.username}`}>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 cursor-pointer">
                      <AvatarImage
                        src={post.creator?.profilePicture}
                        alt={post.creator?.name}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {post.creator?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-neutral-900 text-sm cursor-pointer">
                          {post.creator.name}
                        </span>
                        <CheckmarkBadge02Icon
                          fill="#0073E6"
                          color="white"
                          size={14}
                        />
                      </div>
                      <div className="text-xs text-neutral-900">
                        @{post.creator.username}
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {formatPostTime(post.createdAt)}
                  </span>
                  <button className="text-neutral-500 hover:text-neutral-700">
                    <MoreHorizontalCircle01Icon size={20} color="black" />
                  </button>
                </div>
              </div>
              <p className="mb-4 text-sm font-normal text-neutral-1000 px-4">
                {post.caption}
              </p>
              {post.media.length > 0 && (
                <div
                  className="mb-4 overflow-hidden cursor-pointer w-full h-[424px]"
                  onClick={() => handleLightbox("_", index)}
                >
                  <Image
                    width={600}
                    height={400}
                    src={post.media[0].url}
                    alt={post.caption}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center justify-between px-4 pb-4">
                  <div className="flex gap-4">
                    <button
                      className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                      onClick={() => {
                        setIsLiked(!isLiked);
                      }}
                    >
                      <ThumbsUpIcon
                        color={isLiked ? "#0073e6" : "#141B34"}
                        size={24}
                        fill={isLiked ? "#0073e6" : "white"}
                      />
                    </button>
                    <button
                      className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                      onClick={() => {
                        setIsCommented(!isCommented);
                      }}
                    >
                      <Message01Icon
                        color={isCommented ? "#0073e6" : "#141B34"}
                        size={24}
                        fill={isCommented ? "#0073e6" : "white"}
                      />
                    </button>
                    <button className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 cursor-pointer">
                      <Bookmark02Icon color="#141B34" size={24} />
                    </button>
                  </div>

                  {/* <button

                    onClick={() => handleSendGift(post)}
                    className="flex items-center text-sm font-normal gap-2 text-['#141B34'] hover:text-neutral-900 cursor-pointer"
                  >
                    <DollarCircleIcon size={24} color="#141B34" />
                    Send Gifts
                  </button> */}
                </div>
                {(isLiked || isCommented) && (
                  <div className="text-sm font-normal text-black px-4 pb-4 space-x-5.5">
                    <span>{post.likesCount} Likes</span>
                    <span>{post.commentsCount} Comments</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {hasNextPage && (
          <div ref={ref} className="py-6 flex justify-center items-center">
            {isFetchingNextPage ? (
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="animate-spin h-6 w-6 text-neutral-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span className="text-sm text-neutral-600">
                  Loading more posts...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-bounce">
                  <svg
                    className="h-8 w-8 text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <span className="text-sm text-neutral-600">
                  Scroll to load more
                </span>
              </div>
            )}
          </div>
        )}
        {!hasNextPage && posts.length > 0 && (
          <div className="py-6 text-center text-neutral-500">
            <p className="text-sm">No more posts to load</p>
          </div>
        )}
      </div>
    </div>
  );
};
