import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Eye, EyeOff, Gamepad2 } from 'lucide-react';
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
      id: 'player' as UserType,
      label: 'Jugador',
      icon: User,
      description: 'Regístrate como jugador'
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
      const roleMapping: Record<UserType, number> = {
        'player': 1,
        'admin': 2
      };

      // Preparar datos para el backend
      const data = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
        id_role: roleMapping[formData.userType],
        birthDate: formData.birthDate,
        gender: formData.gender
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background gaming elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-20 left-20 text-white text-9xl">◆</div>
        <div className="absolute bottom-40 right-32 text-white text-7xl">●</div>
        <div className="absolute top-1/3 right-1/4 text-white text-6xl">▲</div>
        <div className="absolute bottom-20 left-1/3 text-white text-8xl">■</div>
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 relative z-10">
        {/* Left Panel - Branding */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-12 flex flex-col items-center justify-center text-white shadow-2xl">
          <div className="bg-white rounded-full p-8 mb-8 shadow-lg">
            <Gamepad2 className="w-24 h-24 text-purple-600" />
          </div>
          
          <h1 className="text-5xl font-bold mb-4 text-center">GameExpert</h1>
          
          <p className="text-xl text-center mb-8 text-purple-100">
            Únete a nuestra plataforma y descubre videojuegos personalizados según tus gustos
          </p>
          
          <div className="space-y-4 text-center">
            <p className="text-lg">🎮 Recomendaciones inteligentes</p>
            <p className="text-lg">🎯 Sistema experto avanzado</p>
            <p className="text-lg">⭐ Comunidad de jugadores</p>
          </div>
        </div>

        {/* Right Panel - Register Form */}
        <div className="bg-white rounded-3xl p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
          <p className="text-gray-600 mb-6">Completa tus datos para registrarte</p>

          {/* User Type Selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {userTypes.map((userType) => {
              const Icon = userType.icon;
              const isSelected = formData.userType === userType.id;
              
              return (
                <button
                  key={userType.id}
                  type="button"
                  onClick={() => setFieldValue('userType', userType.id)}
                  className={`py-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{userType.label}</span>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFieldValue('firstName', e.target.value)}
                  placeholder="Tu nombre"
                  className={`w-full px-4 py-2.5 rounded-xl border-2 focus:border-purple-500 focus:outline-none transition-colors text-sm ${
                    errors.firstName ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFieldValue('lastName', e.target.value)}
                  placeholder="Tu apellido"
                  className={`w-full px-4 py-2.5 rounded-xl border-2 focus:border-purple-500 focus:outline-none transition-colors text-sm ${
                    errors.lastName ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email y Teléfono */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFieldValue('email', e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className={`w-full px-4 py-2.5 rounded-xl border-2 focus:border-purple-500 focus:outline-none transition-colors text-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFieldValue('phone', e.target.value)}
                  placeholder="+57 300 123 4567"
                  className={`w-full px-4 py-2.5 rounded-xl border-2 focus:border-purple-500 focus:outline-none transition-colors text-sm ${
                    errors.phone ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Nombre de Usuario <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFieldValue('username', e.target.value)}
                placeholder="Elige tu nombre de usuario"
                className={`w-full px-4 py-2.5 rounded-xl border-2 focus:border-purple-500 focus:outline-none transition-colors text-sm ${
                  errors.username ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Contraseña y Confirmar */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFieldValue('password', e.target.value)}
                    placeholder="••••••••"
                    maxLength={72}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 focus:border-purple-500 focus:outline-none transition-colors text-sm ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    maxLength={72}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 focus:border-purple-500 focus:outline-none transition-colors text-sm ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Fecha de Nacimiento y Género */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFieldValue('birthDate', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 focus:border-purple-500 focus:outline-none transition-colors text-sm ${
                    errors.birthDate ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Género <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFieldValue('gender', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 focus:border-purple-500 focus:outline-none transition-colors text-sm ${
                    errors.gender ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="">Selecciona tu género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero-no-decir">Prefiero no decir</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl mt-4 ${
                isLoading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
              }`}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-purple-600 hover:text-purple-700 font-bold"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
