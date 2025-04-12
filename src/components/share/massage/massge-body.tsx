"use client";

import { useEffect, useState, useRef, Fragment } from "react";
import {
  StarIcon,
  Notification01Icon,
  PinIcon,
  Image01Icon,
  Search01Icon,
  CircleIcon,
  Copy01Icon,
  ArrowLeft01Icon,
  MoreVerticalIcon,
} from "hugeicons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMassageStore } from "@/data";
import { ActionMenu } from "./actionMenu";
import { Popup_Report_Block_Delete } from "./popup-report-block-delete";
import { Gallery } from "./gallery";
import { ChatRoom, IMessage } from "@/types";
import { fetchSubscriberRooms } from "@/services";
import { useSocket } from "@/hook/useSocket";
import { MassageTypingArea } from "./massageInput/massage-Input-area";
import { MessageView } from "./massageView";
import Loading from "../common/loading";
import { cn } from "@/lib/utils";

interface MassageBodyProps {
  chatroom: ChatRoom;
  isMobile?: boolean;
  onBackClick?: () => void;
}

export const MassageBody = ({
  chatroom,
  isMobile,
  onBackClick,
}: MassageBodyProps) => {
  const { clickedMsg, isPinned, setIsPinned, setISGallery, isGallery } =
    useMassageStore();
  const { messages, isConnected } = useSocket(chatroom.roomId);
  const [creator, setCreator] = useState<{
    name: string;
    profilePicture: string;
    username: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ActionOptions = [
    { label: "Copy Link Profile", icon: <Copy01Icon size={20} /> },
  ];

  // Fetch creator data
  useEffect(() => {
    const fetchCreator = async () => {
      if (chatroom.roomId) {
        const response = await fetchSubscriberRooms();
        if (response.success) {
          const room = response.data.find((r) => r.roomId === clickedMsg);
          if (room && room.creator) setCreator(room.creator);
        }
      }
    };
    fetchCreator();
  }, [chatroom.roomId, clickedMsg]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isGallery]);

  const handleBackArrow = () => {
    setIsPinned(false);
    setISGallery(false);
    if (isMobile && onBackClick) onBackClick();
  };

  // Media array
  interface MediaItem {
    id: string;
    src: string;
    type: "image" | "video";
    isPaid: boolean;
    price: number;
  }
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  useEffect(() => {
    const extractedMedia = messages
      .filter(
        (msg) => msg.imageUrl && (msg.type === "image" || msg.type === "video")
      )
      .map((msg) => ({
        id: msg._id,
        src: msg.imageUrl!,
        type: msg.type as "image" | "video",
        isPaid: msg.isPaid,
        price: msg.price,
      }));
    setMediaItems(extractedMedia);
  }, [messages]);

  // Group messages by date
  const currentDate = new Date();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(currentDate.getDate() - 1);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const groupMessagesByDate = (messages: IMessage[] | null | undefined) => {
    if (!messages || !Array.isArray(messages)) {
      return {};
    }

    return messages.reduce<{
      [date: string]: {
        userMessages: IMessage[];
        receiverMessages: IMessage[];
      };
    }>((acc, message) => {
      let messageDate = new Date(message.sendAt).toLocaleDateString(
        "en-GB",
        options
      );
      if (currentDate.toLocaleDateString("en-GB", options) === messageDate) {
        messageDate = "Today";
      }
      if (yesterdayDate.toLocaleDateString("en-GB", options) === messageDate) {
        messageDate = "Yesterday";
      }
      if (!acc[messageDate]) {
        acc[messageDate] = { userMessages: [], receiverMessages: [] };
      }
      if (message.senderType === "subscriber") {
        acc[messageDate].userMessages.push(message);
      } else {
        acc[messageDate].receiverMessages.push(message);
      }
      return acc;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  const ConversationComp = (message: IMessage, sender: "user" | "receiver") => {
    const formatMessageTime = (dateString: string | Date) => {
      if (!(typeof dateString === "string" || dateString instanceof Date)) {
        return "";
      }
      const date = new Date(dateString);
      return date.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    return (
      <div key={message._id}>
        <div className="mb-8 relative">
          <div
            className={`flex ${sender === "user" ? "justify-start ml-4" : "justify-end mr-4"} items-end relative my-3`}
          >
            <div
              className={`relative rounded-[16px] p-2 ${sender === "user" ? "bg-brand-500 text-white" : "bg-white text-black"} max-w-[100%] lg:max-w-[70%]`}
            >
              {/* Render MessageView for all message types */}
              <MessageView
                message={message.text || ""}
                sender={sender}
                receiver={sender === "user" ? "receiver" : "user"}
                Liked={false}
                replied={false}
                id={message._id!} // Pass messageId
                date={message.sendAt.toString()}
                replying={false}
                type={message.type}
                text={message.text}
                isPaid={message.isPaid}
                price={message.price}
                imageUrl={message.imageUrl}
                creatorId={chatroom.creatorId || chatroom.roomId.split("_")[2]}
                roomId={chatroom.roomId} // Pass roomId to MessageView
              />
              <div
                className={cn(
                  "cursor-pointer absolute bottom-1.5",
                  sender === "receiver" ? "-left-6" : "-right-6"
                )}
              >
                <MoreVerticalIcon
                  size={24}
                  strokeWidth={2}
                  className="text-gray-600"
                />
              </div>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center mr-4 mt-1",
              sender === "receiver" ? "justify-end" : "justify-start pl-2"
            )}
          >
            <div className="flex items-center mr-2">
              <span className="text-xs font-medium text-gray-600 mr-1">
                {formatMessageTime(message.sendAt)}
              </span>
              {/* {sender === "user" && <CheckCheck size={18} />} */}
            </div>
          </div>
          <div
            className={`absolute top-0 ${sender === "user" ? "left-[7px] border-b-brand-500" : "right-[7px] border-b-white"} border-l-[15px] border-l-transparent rotate-180 border-r-[15px] border-r-transparent border-b-[15px]`}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-brand-50 lg:w-[593px] w-full lg:rounded-r-[20px] h-full overflow-auto flex flex-col">
      {/* Top section */}
      <div className="sticky top-0 z-20 bg-white border-b border-border lg:rounded-tr-[20px] p-2.5">
        {isGallery ? (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ArrowLeft01Icon
                className="cursor-pointer"
                onClick={handleBackArrow}
              />
              <div>
                <span className="text-black font-medium text-sm">
                  {isPinned ? "Pinned Messages" : "Gallery"}
                </span>
                <div className="text-neutral-900 font-normal text-sm">
                  With {creator?.name}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ActionMenu
                options={ActionOptions}
                direction="right"
                id={chatroom.roomId}
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {isMobile && (
                <ArrowLeft01Icon
                  className="cursor-pointer"
                  onClick={handleBackArrow}
                />
              )}
              <div className="relative w-10 h-10">
                <Avatar className="w-full h-full">
                  <AvatarImage
                    width={40}
                    height={40}
                    className="rounded-full h-full w-full object-cover"
                    src={creator?.profilePicture || "/placeholder.svg"}
                    alt={creator?.name || "Unknown"}
                  />
                  <AvatarFallback className="w-full h-full flex items-center justify-center bg-gray-200">
                    {creator?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                {chatroom.lastActivity && (
                  <CircleIcon
                    className="absolute bottom-0 right-0"
                    fill="#32C382"
                    color="#32C382"
                    size={10}
                  />
                )}
              </div>
              <div>
                <span className="text-sm font-medium">
                  {creator?.name || "Unknown"}
                </span>
                <div className="flex divide-x-2 text-sm">
                  <span className="pr-3">
                    {isConnected ? "Available now" : "Connecting..."}
                  </span>
                  {!isMobile && (
                    <>
                      <button className="px-2">
                        <StarIcon size={12} />
                      </button>
                      <button className="px-2">
                        <Notification01Icon size={12} />
                      </button>
                      <button
                        className="px-2"
                        onClick={() => setIsPinned(!isPinned)}
                      >
                        <PinIcon size={12} />
                      </button>
                      <button
                        className="px-2"
                        onClick={() => setISGallery(!isGallery)}
                      >
                        <div className="flex gap-1 items-center">
                          <Image01Icon size={12} /> Gallery
                        </div>
                      </button>
                      <button className="px-2">
                        <div className="flex gap-1 items-center">
                          <Search01Icon size={12} /> Find
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <ActionMenu
              options={ActionOptions}
              direction="right"
              id={chatroom.roomId}
            />
          </div>
        )}
      </div>

      {/* Conversation area */}
      {isGallery ? (
        <div className="bg-brand-50 h-full overflow-auto">
          <Gallery mediaItems={mediaItems} />
        </div>
      ) : (
        <div className="bg-brand-50 h-full overflow-auto pt-4">
          {Object.keys(groupedMessages).length > 0 ? (
            Object.keys(groupedMessages).map((date, i) => {
              const allMessages = [
                ...(groupedMessages[date]?.userMessages || []),
                ...(groupedMessages[date]?.receiverMessages || []),
              ].sort((a, b) => {
                const dateA =
                  a.sendAt instanceof Date ? a.sendAt : new Date(a.sendAt);
                const dateB =
                  b.sendAt instanceof Date ? b.sendAt : new Date(b.sendAt);
                return dateA.getTime() - dateB.getTime();
              });
              return (
                <Fragment key={i}>
                  <div className="mb-10">
                    <div className="flex items-center">
                      <div className="flex-grow h-px bg-brand-100"></div>
                      <h3 className="mx-4 px-4 py-1 rounded-full text-sm font-normal text-center bg-brand-100 text-brand-800">
                        {date}
                      </h3>
                      <div className="flex-grow h-px bg-brand-100"></div>
                    </div>
                    <div className="messages">
                      <div className="my-5">
                        {allMessages.map((message) =>
                          ConversationComp(
                            message,
                            message.senderType === "subscriber"
                              ? "receiver"
                              : "user"
                          )
                        )}
                      </div>
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </Fragment>
              );
            })
          ) : (
            <Loading width={"594px"} />
          )}
        </div>
      )}

      {/* Message Input */}
      {!isGallery && (
        <MassageTypingArea
          roomId={chatroom.roomId}
          creatorId={chatroom.creatorId || chatroom.roomId.split("_")[2]}
        />
      )}

      <Popup_Report_Block_Delete />
    </div>
  );
};
