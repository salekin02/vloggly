import { CreatorDetails } from "./chat.type";
import { IMessage } from "./socket-message";

export interface ChatRoom {
  roomId: string;
  creatorId: string;
  participants: string[];
  lastActivity: Date;
  creator: CreatorDetails | null;
  lastMessage: IMessage | null;
}
