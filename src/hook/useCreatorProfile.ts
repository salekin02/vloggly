// src/hooks/useCreatorProfile.ts
import { fetchCreatorProfile, fetchPublicProfile } from "@/services";
import { useQuery } from "@tanstack/react-query";
export function useCreatorProfile(username: string) {
  const {
    data: profileResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["creatorProfile", username],
    queryFn: () => fetchCreatorProfile(username),
    staleTime: 0, // ⬅️ always refetch fresh data
    refetchOnMount: true, // ⬅️ force fetch when component mounts
    refetchOnWindowFocus: false,
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

export function useCreatorpublic(username: string) {
  const {
    data: profileResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["creatorProfile", username],
    queryFn: () => fetchPublicProfile(username),
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
