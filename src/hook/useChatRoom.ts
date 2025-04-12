// src/hooks/useChatRoom.ts
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/data";
import { createChatRoom, fetchSubscriberRooms } from "@/services";
import { ChatRoom } from "@/types";

export function useChatRoom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const router = useRouter();

  const startChat = useCallback(
    async (creatorId: string) => {
      if (!user?.id) {
        console.error("User not logged in");
        router.push("/sign-in");
        return;
      }

      setLoading(true);
      setError(null);
      const subscriberId = user.id;
      const roomId = `chat_${subscriberId}_${creatorId}`;

      try {
        console.log("Fetching rooms for subscriber:", subscriberId);
        const roomsResponse = await fetchSubscriberRooms();
        console.log("Rooms response:", roomsResponse);
        if (!roomsResponse.success) {
          throw new Error(roomsResponse.message || "Failed to fetch rooms");
        }

        const existingRoom = roomsResponse.data.find(
          (room: ChatRoom) => room.roomId === roomId
        );

        if (existingRoom) {
          console.log(`Navigating to existing room: ${roomId}`);
          router.push(`/messages?roomId=${roomId}`);
        } else {
          console.log("Creating new room for:", { subscriberId, creatorId });
          const createResponse = await createChatRoom(subscriberId, creatorId);
          if (createResponse.success) {
            console.log(`Created new room: ${createResponse.data.roomId}`);
            router.push(`/messages?roomId=${createResponse.data.roomId}`);
          } else {
            throw new Error(
              createResponse.message || "Failed to create chat room"
            );
          }
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        console.error("Error starting chat:", errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [user, router]
  );

  return { startChat, loading, error };
}
