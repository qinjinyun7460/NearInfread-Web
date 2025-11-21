import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000';

const request = axios.create({
  baseURL: API_BASE
});

request.interceptors.request.use(
  (config) => {
    const current_user_id = sessionStorage.getItem('current_user_id');
    if (current_user_id) {
      config.params = {
        ...config.params,
        current_user_id: current_user_id
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
