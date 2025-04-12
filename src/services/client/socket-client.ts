import { getCookie } from "cookies-next";
import { io, Socket } from "socket.io-client";

export const initializeSocket = async (): Promise<Socket> => {
  const accessToken = await getCookie("accessToken");
  const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const newSocket = io(socketUrl, {
    extraHeaders: {
      "x-auth-token": `${accessToken || ""}`, // Handle undefined token
    },
    reconnection: true, // Enable auto-reconnect
    reconnectionAttempts: 5, // Max reconnection attempts
    reconnectionDelay: 1000, // Wait 1s between retries
    reconnectionDelayMax: 5000, // Max delay 5s
  });

  return newSocket;
};

export const disconnectSocket = (socket: Socket | null) => {
  if (socket) {
    socket.disconnect();
  }
};
