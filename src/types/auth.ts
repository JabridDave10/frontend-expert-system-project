export type UserType = 'patient' | 'doctor' | 'admin';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  identification: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: UserType;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  identification: string;
  phone: string;
  email: string;
  password: string;
  id_role: number;
}

export interface UserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  identification: string;
  phone: string;
  email: string;
  id_status: boolean;
  id_role: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  id_role: number;
  id_status: boolean;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: UserInfo;
}
