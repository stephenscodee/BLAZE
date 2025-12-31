import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const blazeApi = axios.create({
  baseURL: 'http://localhost:3000', // Adjust for physical device
  timeout: 10000,
});

blazeApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default blazeApi;
