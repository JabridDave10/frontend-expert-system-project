import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export interface CitaCreate {
  fecha_hora: string; // ISO string format
  motivo?: string;
  estado?: string;
  id_paciente: number;
  id_doctor: number;
}

export interface CitaResponse {
  id_cita: number;
  fecha_hora: string;
  motivo?: string;
  estado: string;
  id_paciente: number;
  id_doctor: number;
}

export interface DashboardStats {
  today_appointments: number;
  active_patients: number;
  pending_appointments: number;
}

export interface TodayAppointment {
  id: number;
  patient_name: string;
  appointment_date: string;
  reason: string;
  status: string;
  duration: string;
}

// Crear una nueva cita
export const createCita = async (citaData: CitaCreate): Promise<CitaResponse> => {
  try {
    console.log('🚀 Enviando datos de cita:', citaData);
    console.log('🚀 JSON stringified:', JSON.stringify(citaData, null, 2));

    const response = await axios.post(`${BASE_URL}/citas/`, citaData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Para incluir cookies de autenticación
    });

    console.log('✅ Cita creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear cita:', error);
    if (axios.isAxiosError(error)) {
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Response status:', error.response?.status);
      console.error('❌ Response headers:', error.response?.headers);

      const errorMessage = error.response?.data?.detail ||
                          JSON.stringify(error.response?.data) ||
                          'Error al crear la cita';
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// Obtener todas las citas
export const getCitas = async (): Promise<CitaResponse[]> => {
  try {
    console.log('🔍 Obteniendo todas las citas...');

    const response = await axios.get(`${BASE_URL}/citas/`, {
      withCredentials: true,
    });

    console.log('✅ Citas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener citas:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Error al obtener las citas');
    }
    throw error;
  }
};

// Obtener una cita específica por ID
export const getCitaById = async (citaId: number): Promise<CitaResponse> => {
  try {
    console.log(`🔍 Obteniendo cita con ID: ${citaId}`);

    const response = await axios.get(`${BASE_URL}/citas/${citaId}`, {
      withCredentials: true,
    });

    console.log('✅ Cita obtenida:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener cita:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Error al obtener la cita');
    }
    throw error;
  }
};

// Obtener citas de un doctor específico
export const getCitasByDoctor = async (doctorId: number): Promise<CitaResponse[]> => {
  try {
    console.log(`🔍 Obteniendo citas del doctor ID: ${doctorId}`);

    const response = await axios.get(`${BASE_URL}/citas/doctor/${doctorId}`, {
      withCredentials: true,
    });

    console.log('✅ Citas del doctor obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener citas del doctor:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Error al obtener las citas del doctor');
    }
    throw error;
  }
};

// Obtener citas de un paciente específico
export const getCitasByPaciente = async (pacienteId: number): Promise<CitaResponse[]> => {
  try {
    console.log(`🔍 Obteniendo citas del paciente ID: ${pacienteId}`);

    const response = await axios.get(`${BASE_URL}/citas/paciente/${pacienteId}`, {
      withCredentials: true,
    });

    console.log('✅ Citas del paciente obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener citas del paciente:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Error al obtener las citas del paciente');
    }
    throw error;
  }
};

// Probar conexión con el endpoint de citas
export const testCitasConnection = async () => {
  try {
    console.log('🔍 Probando conexión con el endpoint de citas...');

    const response = await axios.get(`${BASE_URL}/citas/test/connection`, {
      withCredentials: true,
    });

    console.log('✅ Conexión exitosa con citas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error de conexión con citas:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Error de conexión');
    }
    throw error;
  }
};

// Obtener estadísticas del dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    console.log('🔍 Obteniendo estadísticas del dashboard...');

    const response = await axios.get(`${BASE_URL}/citas/stats/dashboard`, {
      withCredentials: true,
    });

    console.log('✅ Estadísticas del dashboard obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener estadísticas del dashboard:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Error al obtener las estadísticas del dashboard');
    }
    throw error;
  }
};

// Obtener citas de hoy con detalles
export const getTodayAppointments = async (): Promise<TodayAppointment[]> => {
  try {
    console.log('🔍 Obteniendo citas de hoy...');

    const response = await axios.get(`${BASE_URL}/citas/today`, {
      withCredentials: true,
    });

    console.log('✅ Citas de hoy obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener citas de hoy:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Error al obtener las citas de hoy');
    }
    throw error;
  }
};

// API object para consistencia
export const citasApi = {
  createCita,
  getCitas,
  getCitaById,
  getCitasByDoctor,
  getCitasByPaciente,
  testCitasConnection,
  getDashboardStats,
  getTodayAppointments
};