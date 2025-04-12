import { PaymentHistoryEntry, PaymentMethod, Response } from "@/types";
import { API } from "../client";
import { getApiError } from "@/lib/get-api-error";

export const fetchCards = async (): Promise<Response<PaymentMethod[]>> => {
  try {
    const { data } = await API.get<Response<PaymentMethod[]>>("/user/cards");
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
      data: [],
    };
  }
};

export const addCard = async (
  paymentMethodId: string
): Promise<Response<void>> => {
  try {
    const { data } = await API.post<Response<void>>("/user/cards/add-card", {
      paymentMethodId,
    });
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
    };
  }
};

export const setDefaultCard = async (
  paymentMethodId: string
): Promise<Response<void>> => {
  try {
    const { data } = await API.post<Response<void>>("/user/cards/set-default", {
      paymentMethodId,
    });
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
    };
  }
};

export const removeCard = async (
  paymentMethodId: string
): Promise<Response<void>> => {
  try {
    const { data } = await API.delete<Response<void>>("/user/cards/" + paymentMethodId);
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
    };
  }
};

export const fetchPaymentHistory = async (): Promise<
  Response<PaymentHistoryEntry[]>
> => {
  try {
    const { data } = await API.get<Response<PaymentHistoryEntry[]>>(
      "/user/payments/history"
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
      data: [],
    };
  }
};
