import api from './apiClient';
import { type CreateUserDto, type UserResponseDto } from '../types/auth';

export const register = async (data: CreateUserDto): Promise<UserResponseDto> => {
  const response = await api.post('/register/', data);
  return response.data;
};