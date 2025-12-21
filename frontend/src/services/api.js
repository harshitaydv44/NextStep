import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://nextstep-backend-xj0j.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // ❌ DO NOT redirect during auth flows
    if (
      status === 401 &&
      !url.includes("/users/login") &&
      !url.includes("/users/register") &&
      !url.includes("/users/verify-otp")
    ) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

// ================= AUTH APIs =================
export const authAPI = {
  login: (data) => api.post("/users/login", data),
  register: (data) => api.post("/users/register", data),
  verifyOtp: (data) => api.post("/users/verify-otp", data),
  getCurrentUser: () => api.get("/users/me"),
  updateUserProfile: (data) => api.put("/users/update-profile", data),
};

// ================= MENTOR APIs =================
export const mentorAPI = {
  getAllMentors: () => api.get("/mentors/all"),
  getMentorById: (id) => api.get(`/mentors/${id}`),
  bookMentor: (id, data) =>
    api.post(`/mentors/${id}/book`, data),
};

// ================= ROADMAP APIs =================
export const roadmapAPI = {
  getAllRoadmaps: () => api.get("/roadmaps/all"),
  getRoadmapById: (id) => api.get(`/roadmaps/${id}`),
  getRoadmapsByDomain: (domain) =>
    api.get(`/roadmaps/${domain}`),
  createRoadmap: (data) => api.post("/roadmaps/add", data),
};

// ================= DASHBOARD APIs =================
export const mentorDashboardAPI = {
  getMessages: () => api.get("/mentor/messages"),
  replyToMessage: (id, text) =>
    api.post(`/mentor/messages/${id}/reply`, { text }),
  getSessions: () => api.get("/mentor/sessions"),
};

export const learnerDashboardAPI = {
  getSessions: () => api.get("/users/my-sessions"),
  getMessages: () => api.get("/users/my-messages"),
};

export default api;
