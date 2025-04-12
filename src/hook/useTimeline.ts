import { fetchTimeline } from "@/services/api/timeline";
import { Post, TimelineResponse } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useTimeline(limit: number = 10) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<TimelineResponse, Error>({
    queryKey: ["timeline"],
    queryFn: ({ pageParam = 1 }) => fetchTimeline(pageParam as number, limit),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data;
      return pagination.hasNext ? pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const posts: Post[] =
    data?.pages.flatMap((page) => (page.success ? page.data.posts : [])) || [];

  return {
    posts,
    isLoading,
    error:
      error ||
      (data?.pages[0]?.success === false
        ? new Error(data.pages[0].message)
        : null),
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
