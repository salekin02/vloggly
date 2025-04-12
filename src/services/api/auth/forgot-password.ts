import { Response } from "@/types";
import { getApiError } from "@/lib/get-api-error";
import { API } from "@/services/client";

// Types for forgot password process
interface RequestResetData {
  email: string;
}

interface VerifyResetCodeData {
  email: string;
  code: string;
}

interface ResetPasswordData {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

interface SessionData {
  sessionToken: string;
}

// Step 1: Request password reset
export const requestPasswordReset = async (
  payload: RequestResetData
): Promise<Response<SessionData>> => {
  try {
    const { data } = await API.post<Response<SessionData>>(
      "/auth/password/reset-request",
      payload
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
    };
  }
};

// Step 2: Verify reset code
export const verifyResetCode = async (
  payload: VerifyResetCodeData
): Promise<Response<SessionData>> => {
  try {
    const { data } = await API.post<Response<SessionData>>(
      "/auth/password/verify-code",
      payload
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
    };
  }
};

// Step 3: Reset password
export const resetPassword = async (
  payload: ResetPasswordData
): Promise<Response<void>> => {
  try {
    const { data } = await API.post<Response<void>>(
      "/auth/password/reset",
      payload
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getApiError(error),
    };
  }
};
