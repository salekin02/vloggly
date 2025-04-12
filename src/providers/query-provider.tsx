"use client";

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const QueryProvider = ({ children }: React.PropsWithChildren) => {
  // const [client] = useState(queryClient);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
        gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
        refetchOnWindowFocus: false, // Prevent refetch on window focus
        retry: 1 // Limit retry attempts
      }
    }
  })); // Configured for optimal caching

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
