import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface User {
  id_user: number;
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

// Obtener todos los usuarios
export const getAllUsers = async (): Promise<User[]> => {
  try {
    console.log('🔍 Obteniendo todos los usuarios...');

    const response = await axios.get(`${BASE_URL}/users/`, {
      withCredentials: true,
    });

    console.log('✅ Usuarios obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Error al obtener los usuarios');
    }
    throw error;
  }
};

// Obtener solo pacientes (id_role = 1) - OPTIMIZADO con endpoint del backend
export const getPatients = async (searchTerm?: string): Promise<User[]> => {
  try {
    console.log(`🔍 Obteniendo pacientes con búsqueda: "${searchTerm || 'sin filtro'}"`);

    // Usar el nuevo endpoint optimizado del backend
    const params = new URLSearchParams();
    if (searchTerm && searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }

    const url = `${BASE_URL}/patients/${params.toString() ? `?${params.toString()}` : ''}`;
    console.log(`🚀 Llamando a: ${url}`);

    const response = await axios.get(url, {
      withCredentials: true,
    });

    console.log('✅ Pacientes obtenidos del backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener pacientes:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Error al obtener los pacientes');
    }
    throw error;
  }
};

// Obtener un usuario específico por ID
export const getUserById = async (userId: number): Promise<User> => {
  try {
    console.log(`🔍 Obteniendo usuario con ID: ${userId}`);

    const response = await axios.get(`${BASE_URL}/users/${userId}`, {
      withCredentials: true,
    });

    console.log('✅ Usuario obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Error al obtener el usuario');
    }
    throw error;
  }
};

// Buscar pacientes por término (nombre, apellido o identificación) - OPTIMIZADO
export const searchPatients = async (searchTerm: string): Promise<User[]> => {
  try {
    console.log(`🔍 Buscando pacientes con término: "${searchTerm}"`);

    // Usar directamente el endpoint optimizado del backend
    const patients = await getPatients(searchTerm);

    console.log('✅ Pacientes encontrados:', patients);
    return patients;
  } catch (error) {
    console.error('❌ Error al buscar pacientes:', error);
    throw error;
  }
};

// Obtener usuarios por rol específico
export const getUsersByRole = async (roleId: number): Promise<User[]> => {
  try {
    console.log(`🔍 Obteniendo usuarios con rol: ${roleId}`);

    const response = await axios.get(`${BASE_URL}/users/`, {
      withCredentials: true,
    });

    // Filtrar usuarios por rol en el frontend por ahora
    const filteredUsers = response.data.filter((user: User) => user.id_role === roleId);

    console.log(`✅ Usuarios con rol ${roleId} obtenidos:`, filteredUsers);
    return filteredUsers;
  } catch (error) {
    console.error('❌ Error al obtener usuarios por rol:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Error al obtener los usuarios');
    }
    throw error;
  }
};

// API object para consistencia
export const usersApi = {
  getAllUsers,
  getPatients,
  getUserById,
  searchPatients,
  getUsersByRole
};