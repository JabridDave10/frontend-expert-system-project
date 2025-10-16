import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Eye, EyeOff, Gamepad2, LogIn } from 'lucide-react';
import { useLoginForm } from '../hooks/useLoginForm';
import { login } from '../api/axiosAuth';
import { useAuth } from '../contexts/AuthContext';

type UserType = 'player' | 'admin';

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

  const [selectedUserType, setSelectedUserType] = useState<UserType>('player');
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

      // Login exitoso - redirigir al dashboard específico
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
      id: 'player' as UserType,
      label: 'Jugador',
      icon: User,
      description: 'Accede como jugador'
    },
    {
      id: 'admin' as UserType,
      label: 'Administrador',
      icon: Shield,
      description: 'Accede como administrador'
    }
  ];

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
            Sistema Experto de Recomendación de Videojuegos
          </p>
          
          <div className="space-y-4 text-center">
            <p className="text-lg">🎮 Descubre tu próximo juego favorito</p>
            <p className="text-lg">🎯 Recomendaciones personalizadas</p>
            <p className="text-lg">⭐ Basado en tus preferencias</p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="bg-white rounded-3xl p-10 shadow-2xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
          <p className="text-gray-600 mb-8">Accede para obtener tus recomendaciones</p>

          {/* User Type Selection */}
          <div className="flex gap-4 mb-8">
            {userTypes.map((userType) => {
              const Icon = userType.icon;
              const isSelected = selectedUserType === userType.id;
              
              return (
                <button
                  key={userType.id}
                  onClick={() => setSelectedUserType(userType.id)}
                  className={`flex-1 py-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-semibold">{userType.label}</span>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFieldValue('email', e.target.value)}
                placeholder="jugador@email.com"
                className={`w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 focus:outline-none transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFieldValue('password', e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 focus:outline-none transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700">Recordarme</span>
              </label>
              
              <button type="button" className="text-purple-600 hover:text-purple-700 font-semibold">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
              }`}
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-8 text-gray-600">
            ¿No tienes cuenta?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-purple-600 hover:text-purple-700 font-bold"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
