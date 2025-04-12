import { Post } from "./timeline.type";

export interface Media {
  type: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorProfile {
  userId: string;
  name: string;
  username: string;
  profilePicture: string;
  profileBanner: string;
  bio: string;
  posts: Post[];
  location?: string;
  socialMediaLink: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
}

export interface CreatorProfileResponse {
  success: boolean;
  message: string;
  data: CreatorProfile;
}
