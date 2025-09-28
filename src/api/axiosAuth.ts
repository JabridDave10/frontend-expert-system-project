import api from './apiClient';
import { type LoginFormData, type LoginResponse } from '../types/auth';

export const login = async (loginData: LoginFormData): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', loginData);
  return response.data;
};

export const getCurrentUser = async (): Promise<any> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
