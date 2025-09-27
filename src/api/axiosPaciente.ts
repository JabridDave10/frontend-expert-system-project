import apiClient from './apiClient';

export const getPacientes = async () => {
  const response = await apiClient.get('/pacientes/');
  return response.data;
};

export const getPacienteById = async (id: number) => {
  const response = await apiClient.get(`/pacientes/${id}`);
  return response.data;
};

export const createPaciente = async (data: any) => {
  const response = await apiClient.post('/pacientes/', data);
  return response.data;
};
