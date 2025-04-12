import { getApiError } from "@/lib/get-api-error";
import { API } from "../client";
import { SuggestedCreator, TimelineResponse } from "@/types";

export const fetchTimeline = async (
  page: number = 1,
  limit: number = 10
): Promise<TimelineResponse> => {
  try {
    const { data } = await API.get<TimelineResponse>(
      `/timeline?page=${page}&limit=${limit}`
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
      data: {
        posts: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPage: 1,
          hasNext: false,
        },
      },
    };
  }
};

// New fetchSuggestedCreators
export const fetchSuggestedCreators = async (
  limit: number = 3
): Promise<{ success: boolean; message: string; data: SuggestedCreator[] }> => {
  try {
    const { data } = await API.get<{
      success: boolean;
      message: string;
      data: SuggestedCreator[];
    }>(`/timeline/suggested-account?limit=${limit}`);
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
      data: [],
    };
  }
};
