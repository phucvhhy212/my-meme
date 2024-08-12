import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return { data: res?.data, status: res?.status };
  },
  async (err) => {
    if (err.response && err.response.status === 401) {
      window.location.href = "/login";
      return Promise.reject(err.response.data);
    }
    return Promise.reject(err);
  }
);

export const httpClient = instance;
