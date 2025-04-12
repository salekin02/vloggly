"use client";

import Image from "next/image";
import { useState } from "react";
import {
  DollarCircleIcon,
  Image02Icon,
  SquareLock01Icon,
  Video02Icon,
} from "hugeicons-react";
import { PaymentPopup } from "./payment-popup";
import { useLightboxStore } from "@/data";

interface MessageViewProps {
  message: string;
  id: string;
  sender: "user" | "receiver";
  receiver: "user" | "receiver";
  Liked: boolean;
  replied: boolean;
  imageUrl?: string;
  replying: boolean;
  date: string;
  type?: "text" | "image" | "image-text" | "video" | "video-text" | "tips";
  text?: string;
  isPaid?: boolean;
  price?: number;
  creatorId?: string;
  roomId?: string; // Add roomId prop
}

export const MessageView = ({
  message,
  imageUrl,
  replying,
  type,
  text,
  isPaid = false,
  price,
  id,
  creatorId,
  roomId, // Receive roomId
}: MessageViewProps) => {
  const [hoveredVideo, setHoveredVideo] = useState<boolean>(false);
  const [openDialog, setOpendialog] = useState<boolean>(false);
  const { openLightbox } = useLightboxStore();

  const renderTipAmount = (amount: string) => {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md">
        <DollarCircleIcon size={16} strokeWidth={2} className="text-white" />
        <span className="text-base font-semibold">{amount}</span>
      </div>
    );
  };

  const handleLightbox = (image?: string) => {
    if (image) {
      openLightbox(image);
    }
  };

  const LockedContent = () => {
    return (
      <>
        <div
          className={`relative ${replying ? "w-[100px] h-[100px]" : "lg:w-[360px] w-[300px] h-[340px]"} rounded-[20] overflow-hidden flex items-center justify-center bg-[url('/assets/images/gallery1.jpg')] bg-cover bg-center`}
        >
          <div className="absolute rounded-[20] inset-0 h-full w-full bg-white/10 backdrop-blur-[78px]"></div>
          <SquareLock01Icon className="z-10" color="white" size={30} />
          <div
            className={`${replying && "hidden"} absolute w-[95%] bottom-2 left-2 text-xs z-10`}
          >
            <div className="flex justify-between items-center text-white font-medium text-sm">
              {type === "video" || type === "video-text" ? (
                <div className="flex gap-2.5">
                  <Video02Icon size={20} color="white" />
                  7:10
                </div>
              ) : (
                <div>
                  <Image02Icon />
                </div>
              )}

              <span>€{price}</span>
            </div>
            <button
              className="w-full bg-brand-500 mt-2 py-2 cursor-pointer rounded-lg text-white font-medium text-sm z-10"
              onClick={() => setOpendialog(true)}
            >
              Unlock for €{price}
            </button>
          </div>
        </div>
        {text && <span className="text-sm mt-1">{text}</span>}
      </>
    );
  };

  return (
    <>
      <div>
        {type === "text" && (
          <span
            className="text-base font-normal px-2 inline-block [&_p]:inline [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: text || message }}
          ></span>
        )}
        {type === "tips" && text && renderTipAmount(text)}
        {(type === "image" || type === "image-text") &&
          imageUrl &&
          (isPaid ? (
            LockedContent()
          ) : (
            <div className="w-85 h-90" onClick={() => handleLightbox(imageUrl)}>
              <Image
                src={imageUrl}
                alt="Chat image"
                width={replying ? 60 : 340}
                height={replying ? 80 : 360}
                className="object-cover rounded-[6px] w-full h-full"
              />
              {type === "image-text" && text && (
                <span className="text-sm mt-1">{text}</span>
              )}
            </div>
          ))}
        {(type === "video" || type === "video-text") &&
          imageUrl &&
          (isPaid ? (
            LockedContent()
          ) : (
            <div
              onMouseEnter={() => setHoveredVideo(true)}
              onMouseLeave={() => setHoveredVideo(false)}
            >
              <video
                className={`${replying ? "w-[100px] h-[100px]" : "w-[360px] h-[340px]"} object-cover rounded-[6px]`}
                controls={hoveredVideo}
              >
                <source src={imageUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {type === "video-text" && text && (
                <span className="text-sm mt-1">{text}</span>
              )}
            </div>
          ))}
      </div>

      <PaymentPopup
        price={price}
        creatorId={creatorId}
        openDialog={openDialog}
        setOpendialog={setOpendialog}
        messageId={id}
        roomId={roomId} // Pass roomId to PaymentPopup
      />
    </>
  );
};
