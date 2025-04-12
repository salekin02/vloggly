import { getApiError } from "@/lib/get-api-error";
import { API } from "../client";
import { UserProfileResponse } from "@/types/user-profile.type";
import { uploadFiles } from "./file-upload";

export const fetchUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    const { data } = await API.get<UserProfileResponse>("/user/me");
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
      data: {
        _id: "",
        email: "",
        name: "",
        username: "",
        bio: "",
        profilePicture: "",
        profileBanner: "",
        profileStatus: "inactive",
        isProfileVerified: false,
        role: "subscribers",
        isEmailVerified: false,
        createdAt: "",
        updatedAt: "",
        __v: 0,
        socialMediaLink: {
          instagram: "",
          x: "",
          tiktok: "",
        },
        location: "",
        posts: [],
      },
    };
  }
};

export const fetchPublicUserProfile = async (
  username: string
): Promise<UserProfileResponse> => {
  try {
    const { data } = await API.get<UserProfileResponse>(
      `/creator/:${username}/public`
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
      data: {
        _id: "",
        email: "",
        name: "",
        username: "",
        bio: "",
        profilePicture: "",
        profileBanner: "",
        profileStatus: "inactive",
        isProfileVerified: false,
        role: "subscribers",
        isEmailVerified: false,
        createdAt: "",
        updatedAt: "",
        __v: 0,
        socialMediaLink: {
          instagram: "",
          x: "",
          tiktok: "",
        },
        location: "",
        posts: [],
      },
    };
  }
};

export const updateUserProfile = async (payload: {
  name: string;
  location: string;
  socialMediaLink: { instagram: string; x: string; tiktok: string };
  profilePicture?: File;
  profileBanner?: File;
}): Promise<UserProfileResponse> => {
  try {
    let profilePictureUrl = "";
    let profileBannerUrl = "";

    // Upload files if provided
    const filesToUpload = [];
    if (payload.profilePicture) filesToUpload.push(payload.profilePicture);
    if (payload.profileBanner) filesToUpload.push(payload.profileBanner);

    if (filesToUpload.length > 0) {
      const uploadResponse = await uploadFiles(filesToUpload, "profile");
      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message || "File upload failed");
      }
      const uploadedUrls = uploadResponse.data.map((item) => item.url);
      profilePictureUrl = payload.profilePicture
        ? uploadedUrls.shift() || ""
        : "";
      profileBannerUrl = payload.profileBanner
        ? uploadedUrls.shift() || ""
        : "";
    }

    // Prepare the payload for the profile update
    const updatePayload = {
      name: payload.name,
      location: payload.location,
      socialMediaLink: payload.socialMediaLink,
      ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
      ...(profileBannerUrl && { profileBanner: profileBannerUrl }),
    };

    const { data } = await API.put<UserProfileResponse>(
      "/user/me",
      updatePayload
    );
    return data;
  } catch (error) {
    throw new Error(getApiError(error));
  }
};
