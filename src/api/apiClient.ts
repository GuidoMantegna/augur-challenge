import axios from "axios";
import { toast } from "react-toastify";

export const apiClient = axios.create({
  // @ts-ignore
  baseURL: process.env.NODE_ENV === "production" ? process.env.API_URL : "http://localhost:3001",
});

export const apiRequest = async ({
  method,
  url,
  data,
  params,
  config,
  setLoading,
  setError,
}: {
  method: "get" | "post" | "put" | "delete";
  url: string;
  data?: any;
  params?: any;
  config?: any;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}) => {
  setLoading(true);
  try {
    const response = await apiClient.request({
      method,
      url,
      data,
      params,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    toast(error.message,{
      type: "error",
      toastId: "api-error",
    });
    setError(error);
    throw error;
  } finally {
    setLoading(false);
  }
};
