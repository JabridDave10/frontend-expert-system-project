import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type UserInfo } from '../types/auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (user: UserInfo) => void;
  logout: () => void;
  loading: boolean;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async (): Promise<boolean> => {
    console.log('🔍 [AuthContext] Verificando autenticación...');
    console.log('🔍 [AuthContext] BASE_URL:', BASE_URL);

    try {
      console.log('🔍 [AuthContext] Haciendo fetch a /auth/me con credentials: include');
      const response = await fetch(`${BASE_URL}/auth/me`, {
        credentials: 'include'
      });

      console.log('🔍 [AuthContext] Response status:', response.status);
      console.log('🔍 [AuthContext] Response ok:', response.ok);
      console.log('🔍 [AuthContext] Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ [AuthContext] Usuario autenticado:', userData);
        setUser(userData);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ [AuthContext] No autenticado. Error:', errorData);
        return false;
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error checking auth:', error);
      return false;
    }
  };

  useEffect(() => {
    console.log('🚀 [AuthContext] useEffect ejecutado - Inicializando autenticación');

    // Verificar si hay una sesión activa al cargar la aplicación
    const initAuth = async () => {
      console.log('🔄 [AuthContext] Llamando a checkAuth()...');
      const isAuth = await checkAuth();
      console.log('🔄 [AuthContext] Resultado de checkAuth():', isAuth);
      setLoading(false);
      console.log('✅ [AuthContext] Loading establecido en false');
    };

    initAuth();
  }, []);

  const login = (userData: UserInfo) => {
    console.log('📝 [AuthContext] Login llamado con usuario:', userData);
    setUser(userData);
    console.log('✅ [AuthContext] Usuario establecido en el estado');
  };

  const logout = async () => {
    console.log('🚪 [AuthContext] Logout iniciado');

    try {
      console.log('🔄 [AuthContext] Llamando a /auth/logout');
      // Llamar al endpoint de logout para eliminar la cookie HttpOnly
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      console.log('✅ [AuthContext] Logout response status:', response.status);
    } catch (error) {
      console.error('❌ [AuthContext] Error during logout:', error);
    } finally {
      setUser(null);
      console.log('✅ [AuthContext] Usuario eliminado del estado');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
