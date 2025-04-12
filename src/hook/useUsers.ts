import { fetchUserProfile } from "@/services/api/user-profile";
import { useQuery } from "@tanstack/react-query";

export function useUserProfile() {
  const {
    data: profileResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000,
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
    refetch, // Expose refetch function for manual retries
  };
}
