export interface Response<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
