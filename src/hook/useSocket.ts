// src/hook/useSocket.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Socket } from "socket.io-client";
import { IMessage } from "@/types";
import {
  initializeSocket,
  disconnectSocket,
} from "@/services/client/socket-client";

export function useSocket(
  roomId?: string | string[] | null,
  userType: "subscriber" | "agency" = "subscriber",
  asCreator: boolean = false
) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const lastPaymentConfirmed = useRef<Map<string, number>>(new Map());

  const handleConnect = useCallback(() => {
    console.log(
      `Socket connected for ${
        Array.isArray(roomId)
          ? `rooms: ${roomId.join(", ")}`
          : `room: ${roomId || "none"}`
      }`
    );
    setIsConnected(true);
    setConnectionError(null);
    if (socketRef.current && roomId) {
      const rooms = Array.isArray(roomId) ? roomId : [roomId];
      rooms.forEach((id) =>
        socketRef.current!.emit("joinRoom", { roomId: id, userType })
      );
    }
  }, [roomId, userType]);

  const handleDisconnect = useCallback(() => {
    console.log("Socket disconnected");
    setIsConnected(false);
  }, []);

  const handleRoomMessages = useCallback((msgs: IMessage[]) => {
    setMessages(() => {
      const updatedMessages = msgs.map((msg) => {
        const paymentTimestamp = lastPaymentConfirmed.current.get(msg._id);
        const msgUpdatedAt = msg.updatedAt
          ? new Date(msg.updatedAt).getTime()
          : 0;
        return {
          ...msg,
          isPaid:
            paymentTimestamp &&
            (!msgUpdatedAt || paymentTimestamp > msgUpdatedAt)
              ? false
              : msg.isPaid,
        };
      });
      return updatedMessages;
    });
  }, []);

  const handleReceiveMessage = useCallback((msg: IMessage) => {
    console.log("Received message:", msg);
    setMessages((prev) => {
      const existingMessage = prev.find((m) => m._id === msg._id);
      const paymentTimestamp = lastPaymentConfirmed.current.get(msg._id);
      const msgUpdatedAt = msg.updatedAt
        ? new Date(msg.updatedAt).getTime()
        : 0;

      const updatedMsg = {
        ...msg,
        isPaid:
          paymentTimestamp && (!msgUpdatedAt || paymentTimestamp > msgUpdatedAt)
            ? false
            : existingMessage
              ? existingMessage.isPaid
              : msg.isPaid,
      };

      if (existingMessage) {
        return prev.map((m) => (m._id === msg._id ? updatedMsg : m));
      }
      return [...prev, updatedMsg];
    });
  }, []);

  const handlePaymentConfirmed = useCallback((data: { messageId: string }) => {
    console.log("Payment confirmed:", data);
    const timestamp = Date.now();
    lastPaymentConfirmed.current.set(data.messageId, timestamp);
    setMessages((prev) => {
      const updatedMessages = prev.map((msg) =>
        msg._id === data.messageId ? { ...msg, isPaid: false } : msg
      );
      return updatedMessages;
    });
  }, []);

  const handleError = useCallback((error: { message: string }) => {
    console.error("Socket error:", error.message);
    setIsConnected(false);
    setConnectionError(error.message);
  }, []);

  useEffect(() => {
    let mounted = true;
    const setupSocket = async () => {
      try {
        const newSocket = await initializeSocket();
        console.log("Socket initialized with ID:", newSocket?.id);
        if (!mounted) {
          disconnectSocket(newSocket);
          return;
        }
        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on("connect", handleConnect);
        newSocket.on("disconnect", handleDisconnect);
        newSocket.on("roomMessages", handleRoomMessages);
        newSocket.on("receiveMessage", handleReceiveMessage);
        newSocket.on("paymentConfirmed", handlePaymentConfirmed);
        newSocket.on("error", handleError);
        newSocket.on("connect_error", (err) => {
          console.error("Socket connect_error:", err.message);
          setConnectionError(err.message);
          setIsConnected(false);
        });

        if (!newSocket.connected) {
          console.log("Attempting to connect socket...");
          newSocket.connect();
        }
      } catch (error) {
        console.error("Failed to initialize socket:", error);
        setConnectionError(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    setupSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.off("connect", handleConnect);
        socketRef.current.off("disconnect", handleDisconnect);
        socketRef.current.off("roomMessages", handleRoomMessages);
        socketRef.current.off("receiveMessage", handleReceiveMessage);
        socketRef.current.off("paymentConfirmed", handlePaymentConfirmed);
        socketRef.current.off("error", handleError);
        socketRef.current.off("connect_error");
        disconnectSocket(socketRef.current);
        socketRef.current = null;
      }
      setSocket(null);
      setIsConnected(false);
      setMessages([]);
      setConnectionError(null);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      lastPaymentConfirmed.current.clear();
    };
  }, [
    roomId,
    userType,
    asCreator,
    handleConnect,
    handleDisconnect,
    handleRoomMessages,
    handleReceiveMessage,
    handlePaymentConfirmed,
    handleError,
  ]);

  const sendMessage = useCallback(
    (data: {
      message: string;
      type: string;
      creatorId: string;
      isPaid?: boolean;
      isPaymentDone?: boolean; // Optional
      price?: number;
    }) => {
      if (!socket || !roomId || !socket.connected) {
        console.error("Cannot send message: Socket not ready", {
          socket: !!socket,
          roomId,
          connected: socket?.connected,
        });
        return;
      }
      const payload = {
        ...data,
        roomId: Array.isArray(roomId) ? roomId[0] : roomId,
        userType,
      };
      console.log("Sending message:", payload);
      socket.emit("sendMessage", payload);
    },
    [socket, roomId, userType]
  );

  const sendFile = useCallback(
    (url: string, type: string, creatorId: string, text?: string) => {
      if (!socket || !roomId || !socket.connected) {
        console.error("Cannot send file: Socket not ready", {
          socket: !!socket,
          roomId,
          connected: socket?.connected,
        });
        return;
      }
      const payload = {
        imageUrl: url,
        type,
        creatorId,
        text,
        roomId: Array.isArray(roomId) ? roomId[0] : roomId,
        userType,
      };
      console.log("Sending file:", payload);
      socket.emit("sendFile", payload);
    },
    [socket, roomId, userType]
  );

  const sendPayment = useCallback(
    async (messageId: string, amount: number) => {
      if (!socket || !roomId) {
        console.error(
          "Cannot send payment: Socket not initialized or no roomId.",
          { socket: !!socket, roomId }
        );
        return;
      }
      if (!socket.connected) {
        socket.connect();
        await new Promise<void>((resolve) => {
          socket.on("connect", () => {
            resolve();
          });
          socket.on("connect_error", (err) => {
            console.error(
              "Failed to connect socket for sendPayment:",
              err.message
            );
            resolve();
          });
        });
      }
      if (!socket.connected) {
        console.error("Socket still not connected after attempt.");
        return;
      }
      const payload = {
        messageId,
        amount,
        isPaymentDone: true,
        roomId: Array.isArray(roomId) ? roomId[0] : roomId,
        userType,
      };
      console.log("Sending payment:", payload);
      socket.emit("sendPayment", payload);
    },
    [socket, roomId, userType]
  );

  const startTyping = useCallback(() => {
    if (socket && roomId && socket.connected) {
      socket.emit("typing", {
        roomId: Array.isArray(roomId) ? roomId[0] : roomId,
      });
    }
  }, [socket, roomId]);

  const stopTyping = useCallback(() => {
    if (socket && roomId && socket.connected) {
      socket.emit("stopTyping", {
        roomId: Array.isArray(roomId) ? roomId[0] : roomId,
      });
    }
  }, [socket, roomId]);

  return {
    socket,
    messages,
    isConnected,
    connectionError, // Expose error for UI feedback
    sendMessage,
    sendFile,
    sendPayment,
    startTyping,
    stopTyping,
  };
}
