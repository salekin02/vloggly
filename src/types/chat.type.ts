import { ChatRoom } from "./chat-room";

export interface CreatorDetails {
  name: string;
  username: string;
  profilePicture: string;
  creatorId?: string;
}

export interface ChatRoomResponse {
  success: boolean;
  data: ChatRoom[];
  message?: string;
}

export interface CreateChatRoomResponse {
  success: boolean;
  data: { roomId: string };
  message?: string;
}
