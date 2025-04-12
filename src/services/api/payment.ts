import { Response } from "@/types";
import { API } from "../client";
import { PaymentDetails, PaymentResponse } from "@/types/payment.type";
import { getApiError } from "@/lib/get-api-error";

export const makePayment = async (
  payload: PaymentDetails
): Promise<Response<PaymentResponse>> => {
  try {
    const { data } = await API.post<Response<PaymentResponse>>(
      "/user/payments/pay-default",
      payload
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
      data: {},
    };
  }
};
