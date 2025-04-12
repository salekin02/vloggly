import {
  Response,
  IUser,
  SignUpDataType,
  InitialRegisterData,
  AuthData,
  VerifyEmailData,
  SessionData,
  CompleteRegisterData,
  UpdateProfileData,
} from "@/types";
import { getApiError } from "@/lib/get-api-error";
import { API } from "@/services/client";

// Types for signup process

export const handleApiCall = async <T>(
  endpoint: string,
  payload: object
): Promise<Response<T>> => {
  try {
    const { data } = await API.post<Response<T>>(endpoint, payload);
    return data ?? { success: false, message: "Unexpected API response" };
  } catch (error) {
    return { success: false, message: getApiError(error) };
  }
};

export const emailLogin = (payload: { email: string; password: string }) =>
  handleApiCall<AuthData>("/auth/sign-in", payload);

export const forgotPassword = (payload: { email: string }) =>
  handleApiCall<AuthData>("/auth/forgot-password", payload);

// Step 1: Initial registration
export const initialRegister = (payload: InitialRegisterData) =>
  handleApiCall<SignUpDataType>("/auth/sign-up", payload);

export const resendCode = (payload = {}) =>
  handleApiCall<SignUpDataType>("/auth/resend-verification-code", payload);

// Step 2: Verify email
export const verifyEmail = (payload: VerifyEmailData) =>
  handleApiCall<SessionData>("/auth/verify-email", payload);

// Step 3: Complete registration
export const completeRegister = (payload: CompleteRegisterData) =>
  handleApiCall<AuthData>("/auth/set-password", payload);

// Step 4: Update profile
export const updateProfile = (payload: UpdateProfileData) =>
  handleApiCall<IUser>("/auth/profile/update", payload);
