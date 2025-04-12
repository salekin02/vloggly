import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/services/api/user-profile";
import { UserProfileResponse } from "@/types/user-profile.type";

interface UpdateProfilePayload {
  name: string;
  location: string;
  socialMediaLink: { instagram: string; x: string; tiktok: string };
  profilePicture?: File;
  profileBanner?: File;
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    UserProfileResponse,
    Error,
    UpdateProfilePayload
  >({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["userProfile"], data);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      console.error("Profile update failed:", error.message);
    },
  });

  return {
    updateProfile: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
