import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://deleted.discloud.app/api', // Replace with your API base URL
  timeout: 0, // Timeout of 5 seconds
});

api.defaults.headers.common['Content-Type'] = 'application/json';