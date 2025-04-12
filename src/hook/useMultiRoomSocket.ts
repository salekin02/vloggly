// src/hooks/useMultiRoomSocket.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { IMessage } from "@/types";
import {
  initializeSocket,
  disconnectSocket,
} from "@/services/client/socket-client";

export function useMultiRoomSocket(
  roomIds: string[],
  userType: "subscriber" | "agency" = "subscriber"
) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = useCallback(() => {
    setIsConnected(true);
    if (socket && roomIds.length > 0) {
      socket.emit("joinRooms", { roomIds, userType });
    }
  }, [socket, roomIds, userType]);

  const handleDisconnect = useCallback(() => {
    console.log(`Socket disconnected`);
    setIsConnected(false);
  }, []);

  const handleReceiveMessage = useCallback((msg: IMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  useEffect(() => {
    if (roomIds.length === 0) return;

    let mounted = true;

    const setupSocket = async () => {
      try {
        const newSocket = await initializeSocket();
        if (!mounted) {
          disconnectSocket(newSocket);
          return;
        }

        newSocket.io.opts.query = { roomIds: roomIds.join(",") }; // Pass all roomIds
        setSocket(newSocket);

        newSocket.on("connect", handleConnect);
        newSocket.on("disconnect", handleDisconnect);
        newSocket.on("receiveMessage", handleReceiveMessage);

        if (!newSocket.connected) {
          newSocket.connect();
        }
      } catch (error) {
        console.error("Failed to initialize socket for multiple rooms:", error);
        setIsConnected(false);
      }
    };

    setupSocket();

    return () => {
      mounted = false;
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("receiveMessage", handleReceiveMessage);
        disconnectSocket(socket);
        setSocket(null);
        setIsConnected(false);
        setMessages([]);
      }
    };
  }, [
    roomIds,
    userType,
    handleConnect,
    handleDisconnect,
    handleReceiveMessage,
    socket,
  ]);

  return { messages, isConnected };
}
