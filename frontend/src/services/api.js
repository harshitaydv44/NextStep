import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            data: config.data,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Response Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);


export const authAPI = {
    login: (credentials) => api.post('/users/login', credentials),
    register: (userData) => api.post('/users/register', userData),
    verifyOtp: (data) => api.post('/users/verify-otp', data), // <--- ADDED THIS LINE
    getCurrentUser: () => api.get('/users/me'),
    updateUserProfile: (userData) => api.put('/users/update-profile', userData),
};


export const mentorAPI = {
    getAllMentors: () => api.get('/mentors/all'),
    getMentorById: (id) => api.get(`/mentors/${id}`),
    bookMentor: (mentorId, bookingData) => api.post(`/mentors/${mentorId}/book`, bookingData),
};


export const roadmapAPI = {
    getAllRoadmaps: () => api.get('/roadmaps/all'),
    getRoadmapById: (id) => api.get(`/roadmaps/${id}`),
    getRoadmapsByDomain: (domain) => api.get(`/roadmaps/${domain}`),
    createRoadmap: (roadmapData) => api.post('/roadmaps/add', roadmapData),
};


export const mentorDashboardAPI = {
    getMessages: () => api.get('/mentor/messages'),
    replyToMessage: (conversationId, text) =>
        api.post(`/mentor/messages/${conversationId}/reply`, { text }),
    getSessions: () => api.get('/mentor/sessions'),
    addSessionLink: (sessionId, link) =>
        api.put(`/mentor/sessions/${sessionId}/link`, { link }),
    markSessionCompleted: (sessionId) =>
        api.put(`/mentor/sessions/${sessionId}/complete`),
};

export const learnerDashboardAPI = {
    getSessions: () => api.get('/users/my-sessions'),
    getMessages: () => api.get('/users/my-messages'),
    replyToMessage: (conversationId, text) =>
        api.post(`/users/my-messages/${conversationId}/reply`, { text }),
};


export default api;