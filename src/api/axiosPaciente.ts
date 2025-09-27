import api from './apiClient';

export const getPacientes = async () => {
  const response = await api.get('/pacientes/');
  return response.data;
};

export const getPacienteById = async (id: number) => {
  const response = await api.get(`/pacientes/${id}`);
  return response.data;
};

export const createPaciente = async (data: any) => {
  const response = await api.post('/pacientes/', data);
  return response.data;
};
