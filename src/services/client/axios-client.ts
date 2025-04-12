import axios from "axios";
import { getCookie } from "cookies-next";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;

if (!BASE_URL) {
  console.error("Please add the NEXT_PUBLIC_API_URL in the .env file");
}

const AxiosClient = axios.create({
  baseURL: `${BASE_URL}/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosClient.interceptors.request.use(
  async (config) => {
    const accessToken = await getCookie("accessToken");
    if (accessToken && accessToken !== "undefined") {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { AxiosClient as API };
