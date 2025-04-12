// src/hooks/useCreatorProfile.ts

import { fetchPublicUserProfile } from "@/services/api/user-profile";
import { useQuery } from "@tanstack/react-query";

export function useCreatorPublicProfile(username: string) {
  const {
    data: profileResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["creatorPublicProfile", username],
    queryFn: () => fetchPublicUserProfile(username),
  });

  const profile = profileResponse?.success ? profileResponse.data : null;

  return {
    profile,
    isLoading,
    error:
      error ||
      (profileResponse?.success === false
        ? new Error(profileResponse.message)
        : null),
  };
}
