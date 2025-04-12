export interface Message {
  _id: string;
  senderId: string;
  creatorId: string;
  roomId: string;
  senderType: "creator" | "subscriber";
  sendAt: string;
  type: "text" | "image" | "video" | "image-text" | "video-text" | "tips";
  text?: string;
  imageUrl?: string;
  isPaid: boolean;
  price: number;
  isRead: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  isReported: boolean;
  isBlocked: boolean;
  isPinned: boolean;
}
