import React from 'react';
import {
  Home,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  User,
  Briefcase,
  Shield,
  Plus,
  Clock,
  BarChart3
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  userTypes?: ('patient' | 'doctor' | 'admin')[];
}

interface SidebarProps {
  userType: 'patient' | 'doctor' | 'admin';
  userName: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userType, userName, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getUserIcon = () => {
    switch (userType) {
      case 'doctor':
        return Briefcase;
      case 'admin':
        return Shield;
      default:
        return User;
    }
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'doctor':
        return 'Doctor';
      case 'admin':
        return 'Administrador';
      default:
        return 'Paciente';
    }
  };

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'citas',
      label: 'Mis Citas',
      icon: Calendar,
      path: '/dashboard/citas'
    },
    {
      id: 'agendar-cita',
      label: 'Agendar Cita',
      icon: Plus,
      path: '/agendar-cita',
      userTypes: ['patient']
    },
    {
      id: 'crear-cita',
      label: 'Nueva Cita',
      icon: Plus,
      path: '/crear-cita',
      userTypes: ['doctor', 'admin']
    },
    {
      id: 'gestion-horarios',
      label: 'Gestión de Horarios',
      icon: Clock,
      path: '/gestion-horarios',
      userTypes: ['doctor']
    },
    {
      id: 'patients',
      label: 'Pacientes',
      icon: Users,
      path: '/dashboard/patients',
      userTypes: ['doctor', 'admin']
    },
    {
      id: 'doctors',
      label: 'Doctores',
      icon: Briefcase,
      path: '/dashboard/doctors',
      userTypes: ['admin']
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: BarChart3,
      path: '/dashboard/reports',
      userTypes: ['doctor', 'admin']
    },
    {
      id: 'medical-records',
      label: 'Historial Médico',
      icon: FileText,
      path: '/dashboard/medical-records'
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      path: '/dashboard/settings'
    }
  ];

  const filteredItems = sidebarItems.filter(item =>
    !item.userTypes || item.userTypes.includes(userType)
  );

  const UserIcon = getUserIcon();

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">MedCitas</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Info Section */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
            <p className="text-xs text-gray-500">{getUserTypeLabel()}</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;