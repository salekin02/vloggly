// src/components/share/massage/massage-list.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  PencilEdit02Icon,
  MultiplicationSignIcon,
  CircleIcon,
  PaintBrush01Icon,
} from "hugeicons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMassageStore } from "@/data";
import { ChatRoom, IMessage } from "@/types";
import { fetchSubscriberRooms } from "@/services";
import Loading from "../common/loading";
import { useSocket } from "@/hook/useSocket";

export const MassageList = () => {
  const [activeFilter, setActiveFilter] = useState<string | React.ReactElement>(
    "All"
  );
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { clickedMsg, restricted, setClikedMsg } = useMassageStore();

  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      console.time("MassageList: fetchSubscriberRooms");
      const response = await fetchSubscriberRooms();
      console.timeEnd("MassageList: fetchSubscriberRooms");

      if (response.success) {
        const formattedRooms = response.data.map((room) => ({
          ...room,
          lastActivity: new Date(room.lastActivity),
          lastMessage: room.lastMessage
            ? {
                ...room.lastMessage,
                sendAt: new Date(room.lastMessage.sendAt),
              }
            : null,
        }));
        setRooms(formattedRooms);
      } else {
        console.error("Failed to load rooms:", response.message);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const roomIds = useMemo(() => rooms.map((room) => room.roomId), [rooms]);
  const { messages, isConnected } = useSocket(roomIds, "subscriber", false);

  // Memoize the latest message update logic
  const updateRoomsWithMessage = useCallback((latestMessage: IMessage) => {
    setRooms((prevRooms) => {
      const roomIndex = prevRooms.findIndex(
        (room) => room.roomId === latestMessage.roomId
      );
      if (roomIndex === -1) return prevRooms; // Room not found

      const existingRoom = prevRooms[roomIndex];
      const existingLastMessage = existingRoom.lastMessage;

      // Skip update if lastMessage is the same
      if (
        existingLastMessage &&
        existingLastMessage._id === latestMessage._id
      ) {
        return prevRooms;
      }

      const updatedRoom = {
        ...existingRoom,
        lastMessage: {
          _id: latestMessage._id || `temp-${Date.now()}`,
          text: latestMessage.text || (latestMessage.imageUrl ? "Media" : ""),
          senderId: latestMessage.senderId,
          creatorId: latestMessage.creatorId,
          roomId: latestMessage.roomId,
          senderType: latestMessage.senderType,
          sendAt: new Date(latestMessage.sendAt),
          isRead: latestMessage.isRead || false,
          imageUrl: latestMessage.imageUrl,
          type: latestMessage.type || "text",
          isPaid: latestMessage.isPaid || false,
          price: latestMessage.price || 0,
          isDeleted: latestMessage.isDeleted || false,
          isEdited: latestMessage.isEdited || false,
          isReported: latestMessage.isReported || false,
          isBlocked: latestMessage.isBlocked || false,
          isPinned: latestMessage.isPinned || false,
        },
        lastActivity: new Date(latestMessage.sendAt),
      };

      const updatedRooms = [...prevRooms];
      updatedRooms[roomIndex] = updatedRoom;
      console.log("MassageList: Updated rooms", updatedRooms);
      return updatedRooms;
    });
  }, []);

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];

    updateRoomsWithMessage(latestMessage);
  }, [messages, isConnected, updateRoomsWithMessage]);

  const handleButtonClick = useCallback(
    (filter: string | React.ReactElement) => {
      setActiveFilter(filter);
    },
    []
  );

  const handleMessageClick = useCallback(
    (roomId: string) => {
      setClikedMsg(roomId);
    },
    [setClikedMsg]
  );

  const filters = useMemo(
    () => [
      "All",
      "Unread",
      "Following",
      <PaintBrush01Icon key="paint-brush" size={12} />,
    ],
    []
  );

  const filteredRooms = useMemo(() => {
    if (activeFilter === "All") return rooms;
    if (activeFilter === "Unread") {
      return rooms.filter(
        (room) => room.lastMessage && !room.lastMessage.isRead
      );
    }
    if (activeFilter === "Following") {
      return rooms.filter((room) => room.creator?.creatorId); // Assuming isFollowing exists
    }
    // Handle PaintBrush01Icon filter if needed
    return rooms;
  }, [rooms, activeFilter]);

  return (
    <div className="lg:min-w-[346px] w-full h-full overflow-hidden">
      <div className="flex justify-between items-center p-3 bg-white border-b border-border box-border rounded-tl-[20]">
        <span className="text-sm font-semibold">Messages</span>
        <div className="bg-brand-50 p-3 rounded-full text-brand-600">
          <PencilEdit02Icon size={15} />
        </div>
      </div>
      <div className="h-full">
        <div className="flex space-x-2 bg-white px-4 py-3 overflow-auto">
          {filters.map((filter, i) => (
            <button
              key={i}
              onClick={() => handleButtonClick(filter)}
              className={`px-4 py-2 text-black rounded-full cursor-pointer focus:outline-none transition ${
                activeFilter === filter
                  ? "bg-brand-50 text-brand"
                  : "bg-neutral-200"
              }`}
            >
              <span className="text-xs font-medium">{filter}</span>
            </button>
          ))}
        </div>
        <div className="p-2 bg-white h-screen lg:h-full overflow-auto rounded-bl-[20px]">
          {isLoading ? (
            <Loading width="w-full" />
          ) : filteredRooms.length === 0 ? (
            <p className="text-gray-500">No chat rooms yet.</p>
          ) : (
            filteredRooms.map((room) => (
              <div
                className={`grid grid-cols-7 px-2 py-3 cursor-pointer focus:outline-none transition ${
                  clickedMsg === room.roomId
                    ? "bg-brand-50 rounded-md"
                    : "bg-white"
                } ${restricted.includes(room.roomId) ? "opacity-50" : ""}`}
                key={room.roomId}
                onClick={() => handleMessageClick(room.roomId)}
              >
                <div>
                  <div className="relative w-[36px] h-[36px]">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                        src={room.creator?.profilePicture || "/placeholder.svg"}
                        alt={room.creator?.name || "Unknown"}
                      />
                      <AvatarFallback className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                        {room.creator?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                      {room.lastActivity && (
                        <CircleIcon
                          className="absolute bottom-0 right-0"
                          fill="#32C382"
                          color="#32C382"
                          size={10}
                        />
                      )}
                    </Avatar>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-black">
                      {room.creator?.name || "Unknown"}{" "}
                      <span className="text-neutral-600 font-normal">
                        @{room.creator?.username || "unknown"}
                      </span>
                    </span>
                    <MultiplicationSignIcon size={16} />
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    {room.lastMessage?.text ? (
                      <span
                        className="text-xs font-normal text-black truncate inline-block max-w-full"
                        dangerouslySetInnerHTML={{
                          __html: room.lastMessage?.text,
                        }}
                      />
                    ) : (
                      <span className="text-xs font-normal text-black truncate">
                        {room.lastMessage?.imageUrl
                          ? "Image"
                          : "No messages yet"}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px]">
                        {room.lastActivity
                          ? room.lastActivity.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                      {!room.lastMessage?.isRead && (
                        <CircleIcon fill="#0069d1" color="#0069d1" size={10} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
