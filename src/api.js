import axios from "axios";

const baseURL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL)
  || "http://localhost:3001";

const API = axios.create({ baseURL });

export const getUsers = () => API.get("/users");
export const getUser = (id) => API.get(`/users/${id}`);

export const getAllNews = (params = "") => API.get(`/news${params}`);
export const getNewsById = (id) => API.get(`/news/${id}`);
export const createNews = (newsObj) => API.post("/news", newsObj);
export const patchNews = (id, data) => API.patch(`/news/${id}`, data);
export const deleteNews = (id) => API.delete(`/news/${id}`);

export default API;