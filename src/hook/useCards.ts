import { addCard, fetchCards, fetchPaymentHistory, setDefaultCard, removeCard } from "@/services/api/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCards() {
  const queryClient = useQueryClient();

  // Fetch cards
  const {
    data: cardsResponse,
    isLoading: cardsLoading,
    error: cardsError,
  } = useQuery({
    queryKey: ["cards"],
    queryFn: fetchCards,
  });

  const cards = cardsResponse?.success ? cardsResponse.data || [] : [];

  // Fetch payment history
  const {
    data: historyResponse,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: ["paymentHistory"],
    queryFn: fetchPaymentHistory,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache persists for 30 minutes
  });

  const paymentHistory = historyResponse?.success
    ? historyResponse.data || []
    : [];

  // Add card mutation
  const addCardMutation = useMutation({
    mutationFn: addCard,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["cards"] }); // Refetch cards on success
      }
    },
  });

  // Set default card mutation
  const setDefaultCardMutation = useMutation({
    mutationFn: setDefaultCard,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["cards"] }); // Refetch cards to update default status
      }
    },
  });

  // Remove card mutation
  const removeCardMutation = useMutation({
    mutationFn: removeCard,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["cards"] }); // Refetch cards after removal
      }
    },
  });

  return {
    cards,
    cardsLoading,
    cardsError:
      cardsError ||
      (cardsResponse?.success === false
        ? new Error(cardsResponse.message)
        : null),
    paymentHistory,
    historyLoading,
    historyError:
      historyError ||
      (historyResponse?.success === false
        ? new Error(historyResponse.message)
        : null),
    addCard: addCardMutation.mutate,
    addCardLoading: addCardMutation.isPending,
    addCardError:
      addCardMutation.error ||
      (addCardMutation.data?.success === false
        ? new Error(addCardMutation.data.message)
        : null),
    setDefaultCard: setDefaultCardMutation.mutate,
    setDefaultCardLoading: setDefaultCardMutation.isPending,
    setDefaultCardError:
      setDefaultCardMutation.error ||
      (setDefaultCardMutation.data?.success === false
        ? new Error(setDefaultCardMutation.data.message)
        : null),
    removeCard: removeCardMutation.mutate,
    removeCardLoading: removeCardMutation.isPending,
    removeCardError:
      removeCardMutation.error ||
      (removeCardMutation.data?.success === false
        ? new Error(removeCardMutation.data.message)
        : null),
  };
}
