import { ChatRoomResponse, CreateChatRoomResponse } from "@/types";
import { API } from "../client";

export const fetchSubscriberRooms = async (): Promise<ChatRoomResponse> => {
  try {
    const response = await API.get<ChatRoomResponse>("/user/messages/rooms");
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : "Failed to fetch rooms",
    };
  }
};

export const createChatRoom = async (
  subscriberId: string,
  creatorId: string
): Promise<CreateChatRoomResponse> => {
  try {
    const response = await API.post<CreateChatRoomResponse>(
      "/user/messages/rooms",
      {
        subscriberId,
        creatorId,
      }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: { roomId: "" },
      message:
        error instanceof Error ? error.message : "Failed to create chat room",
    };
  }
};
