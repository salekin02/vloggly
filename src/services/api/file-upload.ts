import { getApiError } from "@/lib/get-api-error";
import { StorageAPI } from "../client";
import { UploadResponse } from "@/types";
import { AxiosRequestConfig } from "axios"; // Import Axios types

// Extend UploadConfig to include Axios config options
interface UploadConfig extends Partial<AxiosRequestConfig> {
  url?: string;
  authToken?: string;
}

export const uploadFiles = async (
  files: File[],
  uploadType: string = "post",
  config: UploadConfig = {}
): Promise<UploadResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  formData.append("uploadType", uploadType);
  console.log("Uploading files:", { files: files.length, uploadType, config });

  const storageUrl =
    config.url ||
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    "https://storage.vloggly.com/api/v1";
  console.log("Storage URL:", storageUrl);

  try {
    const { data } = await StorageAPI.post<UploadResponse>(
      "/bucket",
      formData,
      {
        baseURL: storageUrl,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: config.onUploadProgress, // Pass the progress handler
      }
    );
    console.log("Upload response:", data);
    return data;
  } catch (error) {
    const errorMessage = getApiError(error);
    console.error("Upload error:", errorMessage, error);
    return {
      success: false,
      message: errorMessage,
      data: [],
    };
  }
};
