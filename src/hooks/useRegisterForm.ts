import { useState } from 'react';
import { type RegisterFormData, type UserType } from '../types/auth';

interface UseRegisterFormReturn {
  formData: RegisterFormData;
  errors: Partial<RegisterFormData>;
  isLoading: boolean;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  setFieldValue: (field: keyof RegisterFormData, value: string | UserType) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  setIsLoading: (loading: boolean) => void;
}

const initialFormData: RegisterFormData = {
  firstName: '',
  lastName: '',
  identification: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  userType: 'patient'
};

export const useRegisterForm = (): UseRegisterFormReturn => {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const setFieldValue = (field: keyof RegisterFormData, value: string | UserType) => {
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
    const newErrors: Partial<RegisterFormData> = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

    // Identification validation
    if (!formData.identification.trim()) {
      newErrors.identification = 'La identificación es obligatoria';
    } else if (!/^\d{7,12}$/.test(formData.identification.trim())) {
      newErrors.identification = 'La identificación debe tener entre 7 y 12 dígitos';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\+?[\d\s-()]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (formData.password.length > 72) {
      newErrors.password = 'La contraseña no puede tener más de 72 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
    setFormData,
    setFieldValue,
    validateForm,
    resetForm,
    setIsLoading
  };
};
