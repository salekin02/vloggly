export interface UploadFileResponse {
  url: string;
  key: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: UploadFileResponse[];
}
