import { getApiError } from "@/lib/get-api-error";
import { API } from "../client";
import { CreatorProfileResponse } from "@/types";

export const fetchCreatorProfile = async (
  username: string
): Promise<CreatorProfileResponse> => {
  try {
    const { data } = await API.get<CreatorProfileResponse>(
      `/creator/${username}`
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
      data: {
        userId: "",
        name: "",
        username: "",
        profilePicture: "",
        profileBanner: "",
        bio: "",
        posts: [],
        socialMediaLink: {
          instagram: undefined,
          twitter: undefined,
          tiktok: undefined,
        },
      },
    };
  }
};

export const fetchPublicProfile = async (
  username: string
): Promise<CreatorProfileResponse> => {
  try {
    const { data } = await API.get<CreatorProfileResponse>(
      `/creator/${username}/public`
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
      data: {
        userId: "",
        name: "",
        username: "",
        profilePicture: "",
        profileBanner: "",
        bio: "",
        posts: [],
        socialMediaLink: {
          instagram: undefined,
          twitter: undefined,
          tiktok: undefined,
        },
      },
    };
  }
};
