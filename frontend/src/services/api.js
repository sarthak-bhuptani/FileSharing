import axios from 'axios';
import toast from 'react-hot-toast';

// To connect to your Vercel backend from Netlify:
// You MUST add an environment variable in Netlify called VITE_API_URL
// Example: VITE_API_URL = https://your-backend.vercel.app

const api = axios.create({
  baseURL: import.meta.env.DEV ? 'http://127.0.0.1:3001' : (import.meta.env.VITE_API_URL || ''),
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'An unexpected error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
