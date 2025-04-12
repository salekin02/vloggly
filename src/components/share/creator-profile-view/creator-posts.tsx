"use client";

import Image from "next/image";
import {
  ThumbsUpIcon,
  Message01Icon,
  Bookmark02Icon,
  MoreHorizontalCircle01Icon,
  CheckmarkBadge01Icon,
  DollarCircleIcon,
} from "hugeicons-react";
import { CreatorProfile, Post } from "@/types";
import { useLightboxStore, useProfileStore } from "@/data";
import RecentBar from "./Recent-bar";
import { formatPostTime } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { SendGift } from "../massage/massageInput/sendGiftModal";

interface CreatorPostsProps {
  posts: Post[];
  creator: CreatorProfile;
  viewMode?: "list" | "grid"; // "list" for Posts tab, "grid" for Media tab
}

export const CreatorPosts = ({
  posts,
  creator,
  viewMode = "list",
}: CreatorPostsProps) => {
  const { openLightbox } = useLightboxStore();
  const [isSendGift, setIsSendGift] = useState(false);
  const [currentGiftingTo, setCurrentGiftingTo] = useState<CreatorProfile>();
  const { isLiked, setIsLiked, isCommented, setIsCommented } =
    useProfileStore();
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

  if (viewMode === "grid") {
    // Extract all media URLs from posts
    const mediaItems = posts.flatMap((post) =>
      post.media.map((media) => media.url)
    );

    return (
      <div>
        <RecentBar tab="Grid" />
        <div className="p-4">
          {mediaItems.length === 0 ? (
            <p className="text-center text-neutral-600">No media available</p>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {mediaItems.map((url, index) => (
                <div key={index} className="aspect-square overflow-hidden">
                  <Image
                    src={url}
                    alt={`Media ${index + 1}`}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleSendGift = () => {
    setCurrentGiftingTo(creator);
    setIsSendGift(true);
  };

  const handleTipSuccess = () => {
    toast.success("Gift sent successfully.");
  };

  return (
    <div>
      <RecentBar tab="list" />
      <div className="space-y-1 bg-[#F7F7F7]">
        {posts.length === 0 ? (
          <p className="text-center text-neutral-600 p-4">No posts available</p>
        ) : (
          posts.map((post, index) => (
            <div key={post.postId} className="bg-white">
              <div className="mb-3 flex justify-between px-4 pt-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 overflow-hidden rounded-full cursor-pointer"
                    // onClick={() => handleLightbox(creator.profilePicture)}
                  >
                    <Image
                      width={24}
                      height={24}
                      src={creator.profilePicture}
                      alt={creator.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-neutral-900 text-sm">
                        {creator.name}
                      </span>
                      <CheckmarkBadge01Icon
                        fill="blue"
                        color="white"
                        size={14}
                      />
                    </div>
                    <div className="text-sm text-neutral-600">
                      @{creator.username}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {formatPostTime(post.createdAt)}
                  </span>
                  <button className="text-neutral-500 hover:text-neutral-700">
                    <MoreHorizontalCircle01Icon size={20} color="black" />
                  </button>
                </div>
              </div>
              <p className="mb-4 text-neutral-800 px-4">{post.caption}</p>
              {post.media.length > 0 && (
                <div
                  className="mb-4 overflow-hidden cursor-pointer h-[424px]"
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
                  <button
                    onClick={handleSendGift}
                    className="flex items-center text-sm font-normal gap-2 text-['#141B34'] hover:text-neutral-900 cursor-pointer"
                  >
                    <DollarCircleIcon size={24} color="#141B34" />
                    Send Gifts
                  </button>
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
      </div>

      <SendGift
        open={isSendGift}
        setOpen={setIsSendGift}
        onSuccess={handleTipSuccess}
        creatorId={currentGiftingTo?.userId || ""}
        roomId={""}
      />
    </div>
  );
};
