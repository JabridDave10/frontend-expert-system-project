import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, Shield, Eye, EyeOff, Plus } from 'lucide-react';
import { useLoginForm } from '../hooks/useLoginForm';
import { login } from '../api/axiosAuth';
import { useAuth } from '../contexts/AuthContext';

type UserType = 'patient' | 'doctor' | 'admin';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const {
    formData,
    errors,
    isLoading,
    setFieldValue,
    validateForm,
    setIsLoading
  } = useLoginForm();

  const [selectedUserType, setSelectedUserType] = useState<UserType>('patient');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(formData);
      
      // Guardar los datos del usuario (el token se maneja en cookies HttpOnly)
      authLogin(response.user);
      
      // Login exitoso - redirigir al dashboard
      setSubmitError('');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data?.detail) {
        setSubmitError(error.response.data.detail);
      } else {
        setSubmitError('Error al iniciar sesión. Verifica tus credenciales.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const userTypes = [
    {
      id: 'patient' as UserType,
      label: 'Paciente',
      icon: User,
      description: 'Accede como paciente'
    },
    {
      id: 'doctor' as UserType,
      label: 'Doctor',
      icon: Briefcase,
      description: 'Accede como doctor'
    },
    {
      id: 'admin' as UserType,
      label: 'Administrador',
      icon: Shield,
      description: 'Accede como administrador'
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-500 to-teal-600 flex-col justify-center items-center px-12">
        <div className="text-center text-white">
          {/* Logo */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 mx-auto">
            <Plus className="w-10 h-10 text-cyan-600" />
          </div>
          
          {/* Brand Name */}
          <h1 className="text-5xl font-bold mb-6">MedCitas</h1>
          
          {/* Description */}
          <p className="text-xl leading-relaxed max-w-md">
            Sistema integral de gestión de citas médicas. Conectamos pacientes, doctores y especialistas en una plataforma segura y eficiente.
          </p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
            <p className="text-gray-600">Accede a tu cuenta para gestionar citas médicas</p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {userTypes.map((userType) => {
              const Icon = userType.icon;
              const isSelected = selectedUserType === userType.id;
              
              return (
                <button
                  key={userType.id}
                  onClick={() => setSelectedUserType(userType.id)}
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

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {submitError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFieldValue('email', e.target.value)}
                placeholder="ejemplo@email.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFieldValue('password', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <span className="ml-2 text-sm text-gray-700">Recordarme</span>
              </label>
              <a href="#" className="text-sm text-cyan-600 hover:text-cyan-700">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                    isLoading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white hover:from-cyan-600 hover:to-teal-700'
                  }`}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-cyan-600 hover:text-cyan-700 font-medium underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
