export interface MedicalHistoryData {
  diagnosis: string;
  treatment: string;
  medication: string;
  symptoms: string;
  notes: string;
}

export interface MedicalHistoryCreate {
  id_patient: number;
  id_doctor: number;
  id_appointment: number;
  diagnosis: string;
  treatment: string;
  medication?: string;
  symptoms: string;
  notes?: string;
}

export interface MedicalHistoryResponse {
  id_medical_history: number;
  id_patient: number;
  id_doctor: number;
  id_appointment: number;
  diagnosis: string;
  treatment: string;
  medication?: string;
  symptoms: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
