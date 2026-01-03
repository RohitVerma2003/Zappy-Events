import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.17:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
