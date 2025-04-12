export interface Post {
  postId: string;
  creator: {
    userId: string;
    name: string;
    username: string;
    profilePicture: string;
  };
  media: {
    type: string;
    url: string;
    createdAt: string;
    updatedAt: string;
  }[];
  caption: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface TimelineResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPage: number;
      hasNext: boolean;
    };
  };
}

// Type definition for suggested creator
export interface SuggestedCreator {
  userId: string;
  name: string;
  username: string;
  profilePicture?: string;
  profileBanner?: string;
  bio?: string;
  totalLikes: number;
}
