// src/api/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5555/api', // Change if your backend runs elsewhere
  withCredentials: true, // Important for cookies/session auth
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
