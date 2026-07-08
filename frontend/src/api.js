import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // or your deployed backend URL
  headers: {
    "X-API-Key": import.meta.env.VITE_APP_API_KEY
  }
});

export default api;