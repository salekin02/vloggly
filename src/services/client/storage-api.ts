import axios from "axios";
import { getCookie } from "cookies-next";

export const StorageAPIClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STORAGE_URL,
});

StorageAPIClient.interceptors.request.use(
  async (config) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { StorageAPIClient as StorageAPI };
