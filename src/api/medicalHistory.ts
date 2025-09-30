import api from './apiClient';
import { type MedicalHistoryCreate, type MedicalHistoryResponse } from '../types/medicalHistory';

export const createMedicalHistory = async (data: MedicalHistoryCreate): Promise<MedicalHistoryResponse> => {
  const response = await api.post('/medical-history/create-medical-history', data);
  return response.data;
};

export const getMedicalHistoryByAppointment = async (appointmentId: number): Promise<MedicalHistoryResponse> => {
  const response = await api.get(`/medical-history/appointment/${appointmentId}`);
  return response.data;
};

export const getMedicalHistoriesByPatient = async (patientId: number): Promise<MedicalHistoryResponse[]> => {
  const response = await api.get(`/medical-history/patient/${patientId}`);
  return response.data;
};

export const getMedicalHistoriesByDoctor = async (doctorId: number): Promise<MedicalHistoryResponse[]> => {
  const response = await api.get(`/medical-history/doctor/${doctorId}`);
  return response.data;
};

export const checkMedicalHistoryExists = async (appointmentId: number): Promise<{ has_medical_history: boolean }> => {
  const response = await api.get(`/medical-history/appointment/${appointmentId}/exists`);
  return response.data;
};