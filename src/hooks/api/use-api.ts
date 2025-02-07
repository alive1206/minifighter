import { env } from "@/config";
import axios from "axios";

export const useApi = (url?: string) => {
  const api = axios.create({
    baseURL: url || env.APP_API,
  });

  return { api };
};
