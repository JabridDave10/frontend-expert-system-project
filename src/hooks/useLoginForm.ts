import { useState } from 'react';
import { type LoginFormData } from '../types/auth';

interface UseLoginFormReturn {
  formData: LoginFormData;
  errors: Partial<LoginFormData>;
  isLoading: boolean;
  setFieldValue: (field: keyof LoginFormData, value: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  setIsLoading: (loading: boolean) => void;
}

const initialFormData: LoginFormData = {
  email: '',
  password: ''
};

export const useLoginForm = (): UseLoginFormReturn => {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const setFieldValue = (field: keyof LoginFormData, value: string) => {
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
    const newErrors: Partial<LoginFormData> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
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
