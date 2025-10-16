import React from 'react';
import {
  Home,
  Gamepad2,
  Users,
  Settings,
  LogOut,
  User,
  UserCog,
  Shield,
  Sparkles,
  Clock,
  BarChart3,
  Search,
  Target,
  BookOpen
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  userTypes?: ('player' | 'moderator' | 'admin')[];
}

interface SidebarProps {
  userType: 'player' | 'moderator' | 'admin';
  userName: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userType, userName, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getUserIcon = () => {
    switch (userType) {
      case 'moderator':
        return UserCog;
      case 'admin':
        return Shield;
      default:
        return User;
    }
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'moderator':
        return 'Moderador';
      case 'admin':
        return 'Administrador';
      default:
        return 'Jugador';
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
      id: 'recommendations',
      label: 'Recomendaciones',
      icon: Sparkles,
      path: '/dashboard/recommendations'
    },
    {
      id: 'my-games',
      label: 'Mis Juegos',
      icon: Gamepad2,
      path: '/dashboard/my-games'
    },
    {
      id: 'discover',
      label: 'Descubrir',
      icon: Search,
      path: '/dashboard/discover'
    },
    {
      id: 'genres',
      label: 'Explorar Géneros',
      icon: Target,
      path: '/dashboard/genres',
      userTypes: ['player']
    },
    {
      id: 'guides',
      label: 'Guías y Tips',
      icon: BookOpen,
      path: '/dashboard/guides',
      userTypes: ['player']
    },
    {
      id: 'players',
      label: 'Jugadores',
      icon: Users,
      path: '/dashboard/players',
      userTypes: ['moderator', 'admin']
    },
    {
      id: 'moderators',
      label: 'Moderadores',
      icon: UserCog,
      path: '/dashboard/moderators',
      userTypes: ['admin']
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: BarChart3,
      path: '/dashboard/reports',
      userTypes: ['moderator', 'admin']
    },
    {
      id: 'history',
      label: 'Historial',
      icon: Clock,
      path: '/dashboard/history'
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
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">GameExpert</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Info Section */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
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
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm'
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