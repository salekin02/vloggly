import { PaymentMethod } from "./card.type";

export type AuthState = {
  user: {
    id?: string;
    name?: string;
    email?: string;
    username?: string;
    profilePicture?: string;
  } | null;
  paymentMethods: PaymentMethod[];
  isAuthenticated: boolean;
  checkAuth: () => Promise<boolean>;
  // Signup process state
  currentSignupData?: SignUpDataType | null;
  setCurrentSignupData: (data: SignUpDataType) => void;
  resetSignupState: () => void;
};
interface ErrorData {
  clientError: ClientError;
}

interface ClientError {
  code: string;
  message: string;
}

export interface ErrorRes {
  success: boolean;
  message: string;
  data: ErrorData;
}

export type SignUpDataType = {
  success: boolean;
  message: string;
  data?: {
    user: IUser;
    accessToken: string;
    refreshToken: string;
  };
};

export interface IUser {
  verified: string;
  id: string;
  name: string;
  email: string;
  username: string;
  profilePicture: string;
}

export interface InitialRegisterData {
  name: string;
  email: string;
}

export interface VerifyEmailData {
  verificationCode: string;
}

export interface CompleteRegisterData {
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  username: string;
}

export interface SessionData extends IUser {
  sessionToken: string;
}

export interface AuthData {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  isEmailVerified?: boolean;
}
