import axios from "axios";
import { toast } from "../feedback/notify";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import store from "../redux/store";

const baseURL = import.meta.env.VITE_API_URL || "";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

function isMutatingRequest(config) {
  const m = (config?.method || "get").toLowerCase();
  return ["post", "put", "patch", "delete"].includes(m);
}

function extractErrorMessage(error) {
  const fromBody = error.response?.data;
  if (fromBody != null && typeof fromBody === "object") {
    const msg = fromBody.message ?? fromBody.error;
    if (typeof msg === "string" && msg.length > 0) return msg;
  }
  if (typeof error.message === "string" && error.message.length > 0) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    store.dispatch(showLoading());
    return config;
  },
  (error) => {
    store.dispatch(hideLoading());
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    store.dispatch(hideLoading());

    const cfg = response.config || {};
    const data = response.data;
    if (
      !cfg.skipGlobalErrorToast &&
      isMutatingRequest(cfg) &&
      data &&
      typeof data === "object" &&
      data.success === false &&
      typeof data.message === "string" &&
      data.message.length > 0
    ) {
      toast.error(data.message);
    }

    return response;
  },
  (error) => {
    store.dispatch(hideLoading());

    const cfg = error.config;
    if (
      cfg &&
      !cfg.skipGlobalErrorToast &&
      isMutatingRequest(cfg)
    ) {
      toast.error(extractErrorMessage(error));
    }

    return Promise.reject(error);
  },
);
