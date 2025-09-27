import api from './apiClient';
import { type LoginFormData } from '../types/auth';

export const login = async (loginData: LoginFormData) => {
  const response = await api.post('/auth/login/', loginData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout/');
  return response.data;
};
