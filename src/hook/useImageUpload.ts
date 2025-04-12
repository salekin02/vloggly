// src/hooks/useImageUpload.ts
"use client";

import { getApiError } from "@/lib/get-api-error";
import { uploadFiles } from "@/services/api/file-upload";
import { UploadResponse } from "@/types";
import { useState } from "react";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response: UploadResponse = await uploadFiles([file], "chat"); // Use "chat" as uploadType
      if (response.success && response.data.length > 0) {
        const url = response.data[0].url; // Take the first URL
        setImageUrl(url);
        console.log(`Image uploaded successfully: ${url}`);
        return url;
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (err) {
      const errorMsg = getApiError(err);
      setError(errorMsg);
      console.error(`Image upload failed: ${errorMsg}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error, imageUrl };
}
