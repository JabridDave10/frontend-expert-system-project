import api from './apiClient';
import { type DiagnosticRequest, type DiagnosticResponse } from '../types/assistantAITypes.ts';

export const diagnosticSymptoms = async (data: DiagnosticRequest): Promise<DiagnosticResponse> => {
  const response = await api.post('/assistantAI/diagnostico', data);
  return response.data;
};
