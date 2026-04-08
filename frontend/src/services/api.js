import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:3000',
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
