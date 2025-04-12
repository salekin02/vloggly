import { Post } from "./timeline.type";

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  username: string;
  bio: string;
  profilePicture: string;
  profileBanner: string;
  profileStatus: "active" | "inactive" | string; // Adjust based on possible values
  isProfileVerified: boolean;
  role: "subscribers" | "creator" | string; // Adjust based on possible roles
  isEmailVerified: boolean;
  location: string;
  socialMediaLink: {
    instagram: string;
    x: string;
    tiktok: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  posts: Post[];
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}
