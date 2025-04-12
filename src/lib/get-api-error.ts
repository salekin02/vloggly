import { AxiosError } from "axios";

import { ErrorRes } from "@/types";

export const getApiError = (error: unknown): string => {
  const typedError = error as AxiosError<ErrorRes>;

  return (
    typedError.response?.data?.message ||
    typedError.response?.data?.data?.clientError.message ||
    typedError.message ||
    "An unknown error occurred"
  );
};
