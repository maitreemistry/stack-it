// src/api/api.ts
import axios from './axios';

// Types for responses (optional, but recommended)
export interface AuthResponse {
  success: boolean;
  user?: {
    _id: string;
    fullName: string;
    email: string;
    profilePic: string;
    role: string;
  };
  message?: string;
}

export const signup = async (formData: { email: string; password: string; fullName: string }) => {
  const res = await axios.post<AuthResponse>('/auth/signup', formData);
  return res.data;
};

export const login = async (formData: { email: string; password: string }) => {
  const res = await axios.post<AuthResponse>('/auth/login', formData);
  return res.data;
};

export const logout = async () => {
  const res = await axios.post<{ message: string }>('/auth/logout');
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axios.get<AuthResponse>('/auth/me');
  return res.data;
};
