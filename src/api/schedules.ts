import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
    const response = await axios.post(`${BASE_URL}/schedules/doctor/${doctorId}`, schedule, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  },

  getDoctorSchedule: async (doctorId: number): Promise<{ doctor_id: number; schedules: DoctorSchedule[] }> => {
    const response = await axios.get(`${BASE_URL}/schedules/doctor/${doctorId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  updateSchedule: async (scheduleId: number, schedule: Partial<DoctorSchedule>): Promise<DoctorSchedule> => {
    const response = await axios.put(`${BASE_URL}/schedules/schedule/${scheduleId}`, schedule, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  },

  deleteSchedule: async (scheduleId: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/schedules/schedule/${scheduleId}`, {
      withCredentials: true,
    });
  },

  // Doctor Settings
  getDoctorSettings: async (doctorId: number): Promise<DoctorSettings> => {
    const response = await axios.get(`${BASE_URL}/schedules/doctor/${doctorId}/settings`, {
      withCredentials: true,
    });
    return response.data;
  },

  updateDoctorSettings: async (doctorId: number, settings: Partial<DoctorSettings>): Promise<DoctorSettings> => {
    const response = await axios.put(`${BASE_URL}/schedules/doctor/${doctorId}/settings`, settings, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  },

  // Availability Exceptions
  createException: async (doctorId: number, exception: Omit<AvailabilityException, 'id' | 'doctor_id' | 'created_at'>): Promise<AvailabilityException> => {
    const response = await axios.post(`${BASE_URL}/schedules/doctor/${doctorId}/exceptions`, exception, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  },

  getDoctorExceptions: async (doctorId: number, startDate?: string, endDate?: string): Promise<AvailabilityException[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await axios.get(`${BASE_URL}/schedules/doctor/${doctorId}/exceptions?${params}`, {
      withCredentials: true,
    });
    return response.data;
  },

  deleteException: async (exceptionId: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/schedules/exceptions/${exceptionId}`, {
      withCredentials: true,
    });
  },

  // Availability Queries
  getAvailableSlots: async (doctorId: number, date: string): Promise<AvailableSlots> => {
    const response = await axios.get(`${BASE_URL}/schedules/doctor/${doctorId}/availability?date=${date}`, {
      withCredentials: true,
    });
    return response.data;
  }
};