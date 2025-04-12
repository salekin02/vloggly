import { fetchSuggestedCreators } from "@/services";
import { SuggestedCreator } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useSuggestedCreators(limit: number = 3) {
  const { data, isLoading, error, refetch } = useQuery<
    { success: boolean; message: string; data: SuggestedCreator[] },
    Error
  >({
    queryKey: ["suggestedCreators", limit],
    queryFn: () => fetchSuggestedCreators(limit),
  });

  const suggestedCreators: SuggestedCreator[] = data?.success ? data.data : [];

  return {
    suggestedCreators,
    isLoading,
    error: error || (data?.success === false ? new Error(data.message) : null),
    refetch,
  };
}
