import api from './apiClient';
import axios from 'axios';

// Types
export interface DoctorSchedule {
  id?: number;
  day_of_week: number; // 0=domingo, 1=lunes, ..., 6=sábado
  start_time: string; // HH:MM format
  end_time: string;   // HH:MM format
  is_active: boolean;
  doctor_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface WeeklySchedule {
  schedules: DoctorSchedule[];
}

export interface DoctorSettings {
  id?: number;
  doctor_id?: number;
  appointment_duration: number; // minutes
  break_between_appointments: number; // minutes
  advance_booking_days: number;
  allow_weekend_appointments: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AvailabilityException {
  id?: number;
  doctor_id?: number;
  exception_date: string; // YYYY-MM-DD format
  start_time?: string;    // HH:MM format or null for full day
  end_time?: string;      // HH:MM format or null for full day
  exception_type: 'blocked' | 'custom_hours';
  reason?: string;
  created_at?: string;
}

export interface TimeSlot {
  start_time: string; // HH:MM format
  end_time: string;   // HH:MM format
  is_available: boolean;
}

export interface AvailableSlots {
  doctor_id: number;
  date: string; // YYYY-MM-DD format
  available_slots: TimeSlot[];
}

// Types are already exported with their declarations above

// API Functions
export const schedulesApi = {
  // Doctor Schedules
  createWeeklySchedule: async (doctorId: number, schedule: WeeklySchedule): Promise<DoctorSchedule[]> => {
    try {
      console.log('🚀 SCHEDULES: Enviando datos de horario:', { doctorId, schedule });
      console.log('🚀 SCHEDULES: JSON stringified:', JSON.stringify(schedule, null, 2));
      console.log('🚀 SCHEDULES: Endpoint:', `/schedules/doctor/${doctorId}`);

      const response = await api.post(`/schedules/doctor/${doctorId}`, schedule);

      console.log('✅ SCHEDULES: Horario creado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ SCHEDULES: Error al crear horario:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ SCHEDULES: Response data:', error.response?.data);
        console.error('❌ SCHEDULES: Response status:', error.response?.status);
        console.error('❌ SCHEDULES: Response headers:', error.response?.headers);
        console.error('❌ SCHEDULES: Request config:', error.config);

        const errorMessage = error.response?.data?.detail ||
                            JSON.stringify(error.response?.data) ||
                            'Error al crear el horario';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  getDoctorSchedule: async (doctorId: number): Promise<{ doctor_id: number; schedules: DoctorSchedule[] }> => {
    try {
      console.log('🔍 SCHEDULES: Obteniendo horario del doctor:', doctorId);
      console.log('🔍 SCHEDULES: Endpoint:', `/schedules/doctor/${doctorId}`);

      const response = await api.get(`/schedules/doctor/${doctorId}`);

      console.log('✅ SCHEDULES: Horario obtenido exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ SCHEDULES: Error al obtener horario:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ SCHEDULES: Response data:', error.response?.data);
        console.error('❌ SCHEDULES: Response status:', error.response?.status);
        console.error('❌ SCHEDULES: Response headers:', error.response?.headers);
        console.error('❌ SCHEDULES: Request config:', error.config);
      }
      throw error;
    }
  },

  updateSchedule: async (scheduleId: number, schedule: Partial<DoctorSchedule>): Promise<DoctorSchedule> => {
    const response = await api.put(`/schedules/schedule/${scheduleId}`, schedule);
    return response.data;
  },

  deleteSchedule: async (scheduleId: number): Promise<void> => {
    await api.delete(`/schedules/schedule/${scheduleId}`);
  },

  // Doctor Settings
  getDoctorSettings: async (doctorId: number): Promise<DoctorSettings> => {
    const response = await api.get(`/schedules/doctor/${doctorId}/settings`);
    return response.data;
  },

  updateDoctorSettings: async (doctorId: number, settings: Partial<DoctorSettings>): Promise<DoctorSettings> => {
    const response = await api.put(`/schedules/doctor/${doctorId}/settings`, settings);
    return response.data;
  },

  // Availability Exceptions
  createException: async (doctorId: number, exception: Omit<AvailabilityException, 'id' | 'doctor_id' | 'created_at'>): Promise<AvailabilityException> => {
    const response = await api.post(`/schedules/doctor/${doctorId}/exceptions`, exception);
    return response.data;
  },

  getDoctorExceptions: async (doctorId: number, startDate?: string, endDate?: string): Promise<AvailabilityException[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await api.get(`/schedules/doctor/${doctorId}/exceptions?${params}`);
    return response.data;
  },

  deleteException: async (exceptionId: number): Promise<void> => {
    await api.delete(`/schedules/exceptions/${exceptionId}`);
  },

  // Availability Queries
  getAvailableSlots: async (doctorId: number, date: string): Promise<AvailableSlots> => {
    const response = await api.get(`/schedules/doctor/${doctorId}/availability?date=${date}`);
    return response.data;
  }
};