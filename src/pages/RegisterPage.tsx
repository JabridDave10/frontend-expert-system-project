import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, Shield, Eye, EyeOff, Plus } from 'lucide-react';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { register } from '../api/axiosRegister.ts';
import { type UserType } from '../types/auth';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    isLoading,
    setFieldValue,
    validateForm,
    resetForm,
    setIsLoading
  } = useRegisterForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  const userTypes = [
    {
      id: 'patient' as UserType,
      label: 'Paciente',
      icon: User,
      description: 'Regístrate como paciente'
    },
    {
      id: 'doctor' as UserType,
      label: 'Doctor',
      icon: Briefcase,
      description: 'Regístrate como doctor'
    },
    {
      id: 'admin' as UserType,
      label: 'Admin',
      icon: Shield,
      description: 'Regístrate como administrador'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log(formData);
      // Mapear userType a id_role
      const roleMapping = {
        'patient': 1,
        'doctor': 2,
        'admin': 3
      };

      // Preparar datos para el backend
      const data = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        identification: formData.identification.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
        id_role: roleMapping[formData.userType]
      };
      console.log(data);

      const response = await register(data);
      
      setSubmitSuccess(`¡Registro exitoso! Bienvenido ${response.firstName} ${response.lastName}`);
      resetForm();
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: any) {
      console.error('Error en el registro:', error);
      
      if (error.response?.data?.detail) {
        setSubmitError(error.response.data.detail);
      } else if (error.response?.status === 400) {
        setSubmitError('Datos inválidos. Por favor, revisa la información ingresada.');
      } else if (error.response?.status === 409) {
        setSubmitError('El correo electrónico o identificación ya están registrados.');
      } else {
        setSubmitError('Error al crear la cuenta. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-cyan-500 to-teal-600 flex-col justify-center items-center px-12">
        <div className="text-center text-white">
          {/* Logo */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 mx-auto">
            <Plus className="w-10 h-10 text-cyan-600" />
          </div>
          
          {/* Brand Name */}
          <h1 className="text-5xl font-bold mb-6">MedCitas</h1>
          
          {/* Description */}
          <p className="text-xl leading-relaxed max-w-md">
            Únete a nuestra plataforma médica y comienza a gestionar citas de manera eficiente y segura.
          </p>
        </div>
      </div>

      {/* Right Section - Register Form */}
      <div className="w-full lg:w-2/3 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
            <p className="text-gray-600">Completa tus datos para registrarte</p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {userTypes.map((userType) => {
              const Icon = userType.icon;
              const isSelected = formData.userType === userType.id;
              
              return (
                <button
                  key={userType.id}
                  type="button"
                  onClick={() => setFieldValue('userType', userType.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-500 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-cyan-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  <span className="text-sm font-medium">{userType.label}</span>
                </button>
              );
            })}
          </div>

          {/* Success/Error Messages */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {submitSuccess}
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFieldValue('firstName', e.target.value)}
                  placeholder="Tu nombre"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFieldValue('lastName', e.target.value)}
                  placeholder="Tu apellido"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFieldValue('email', e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFieldValue('phone', e.target.value)}
                  placeholder="+57 300 123 4567"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Identification */}
            <div>
              <label htmlFor="identification" className="block text-sm font-medium text-gray-700 mb-2">
                Identificación <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="identification"
                value={formData.identification}
                onChange={(e) => setFieldValue('identification', e.target.value)}
                placeholder="1234567890"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
                  errors.identification ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.identification && (
                <p className="mt-1 text-sm text-red-600">{errors.identification}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFieldValue('password', e.target.value)}
                    placeholder="********"
                    maxLength={72}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
                    placeholder="********"
                    maxLength={72}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-cyan-600 hover:text-cyan-700 font-medium underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
