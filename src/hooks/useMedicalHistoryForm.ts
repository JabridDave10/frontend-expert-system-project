import { useState } from 'react';
import { type MedicalHistoryData } from '../types/medicalHistory';

interface UseMedicalHistoryFormReturn {
  formData: MedicalHistoryData;
  errors: Partial<MedicalHistoryData>;
  isLoading: boolean;
  setFieldValue: (field: keyof MedicalHistoryData, value: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  setIsLoading: (loading: boolean) => void;
}

const initialFormData: MedicalHistoryData = {
  diagnosis: '',
  treatment: '',
  medication: '',
  symptoms: '',
  notes: ''
};

export const useMedicalHistoryForm = (): UseMedicalHistoryFormReturn => {
  const [formData, setFormData] = useState<MedicalHistoryData>(initialFormData);
  const [errors, setErrors] = useState<Partial<MedicalHistoryData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const setFieldValue = (field: keyof MedicalHistoryData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<MedicalHistoryData> = {};

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'El diagnóstico es obligatorio';
    }

    if (!formData.treatment.trim()) {
      newErrors.treatment = 'El tratamiento es obligatorio';
    }

    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Los síntomas son obligatorios';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsLoading(false);
  };

  return {
    formData,
    errors,
    isLoading,
    setFieldValue,
    validateForm,
    resetForm,
    setIsLoading
  };
};
