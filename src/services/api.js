import axios from "axios";

const api = axios.create({
  // baseURL: 'http://18.231.25.86/api/',
  baseURL: 'http://localhost:3333/api/',
});

api.interceptors.request.use(async config => {
  const token = localStorage.getItem('@App:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
