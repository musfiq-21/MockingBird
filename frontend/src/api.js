import axios from "axios";

const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && window.location.pathname !== "/") {
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("loggedUser");
            window.location.href = "/";
        }
        return Promise.reject(err);
    }
);

// Auth
export const loginUser = (credentials) => API.post("/auth/login", credentials);
export const registerUser = (data) => API.post("/auth/register", data);

// Users
export const getUsers = () => API.get("/users");

// News
export const getAllNews = () => API.get("/news");
export const getNewsById = (id) => API.get(`/news/${id}`);
export const createNews = (data) => API.post("/news", data);
export const patchNews = (id, data) => API.patch(`/news/${id}`, data);
export const deleteNews = (id) => API.delete(`/news/${id}`);

// Comments
export const addComment = (newsId, data) => API.post(`/news/${newsId}/comments`, data);

export default API;