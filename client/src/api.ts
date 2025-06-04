import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add the token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

// Authentication service methods
export const registerUser = (userData: any) => api.post('/auth/register', userData);
export const loginUser = (userData: any) => api.post('/auth/login', userData);

// Todo service methods
export const getTodos = () => api.get('/todos');
export const createTodo = (todoData: { task: string; isDone?: boolean }) => api.post('/todos', todoData);
export const updateTodo = (id: string, todoData: { task?: string; isDone?: boolean }) => api.put(`/todos/${id}`, todoData);
export const deleteTodo = (id: string) => api.delete(`/todos/${id}`);
