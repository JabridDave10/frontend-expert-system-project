import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Star,
  Users,
  Activity,
  Brain,
  Shield,
  TrendingUp,
  Target,
  ChevronRight
} from 'lucide-react';

interface ModeratorStats {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  sublabel: string;
}

interface QuickAction {
  title: string;
  subtitle: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  path: string;
}

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats: ModeratorStats[] = [
    { label: 'Total Juegos', value: '4,000', icon: Gamepad2, color: 'bg-blue-500', sublabel: 'En catálogo' },
    { label: 'Usuarios Activos', value: '1,247', icon: Users, color: 'bg-green-500', sublabel: 'Este mes' },
    { label: 'Recomendaciones', value: '8,456', icon: Star, color: 'bg-purple-500', sublabel: 'Generadas' },
    { label: 'Consultas IA', value: '2,134', icon: Brain, color: 'bg-orange-500', sublabel: 'Este mes' }
  ];

  const quickActions: QuickAction[] = [
    {
      title: 'Sistema Experto',
      subtitle: 'Consultar recomendaciones IA',
      icon: Brain,
      color: 'from-blue-500 to-purple-600',
      path: '/dashboard/expert-system'
    },
    {
      title: 'Diagnóstico Rápido',
      subtitle: 'Recomendaciones rápidas',
      icon: Target,
      color: 'from-green-500 to-teal-600',
      path: '/dashboard/recommendations'
    },
    {
      title: 'Descubrir Juegos',
      subtitle: 'Explorar catálogo completo',
      icon: Gamepad2,
      color: 'from-purple-500 to-pink-600',
      path: '/dashboard/discover'
    },
    {
      title: 'Actividad Usuarios',
      subtitle: 'Ver estadísticas y reportes',
      icon: Activity,
      color: 'from-orange-500 to-red-600',
      path: '/dashboard/activity'
    }
  ];

  const recentActivity = [
    {
      id: '1',
      user: 'Juan Pérez',
      action: 'Consultó sistema experto',
      detail: 'Género: RPG, Calidad: Alta',
      time: 'Hace 5 min',
      icon: Brain,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: '2',
      user: 'María González',
      action: 'Nueva recomendación',
      detail: 'The Witcher 3 - Match: 95%',
      time: 'Hace 15 min',
      icon: Star,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: '3',
      user: 'Carlos Ruiz',
      action: 'Añadió a biblioteca',
      detail: 'Elden Ring',
      time: 'Hace 30 min',
      icon: Gamepad2,
      color: 'bg-green-100 text-green-700'
    },
    {
      id: '4',
      user: 'Ana López',
      action: 'Valoró juego',
      detail: 'Stardew Valley - 5 estrellas',
      time: 'Hace 1 hora',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-700'
    }
  ];

  const topGames = [
    { title: 'The Witcher 3: Wild Hunt', recommendations: 342, rating: 4.8 },
    { title: 'Elden Ring', recommendations: 298, rating: 4.7 },
    { title: 'Stardew Valley', recommendations: 276, rating: 4.9 },
    { title: 'Hades', recommendations: 254, rating: 4.8 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Panel de Moderación</h2>
            <p className="text-blue-100">
              Monitorea y gestiona el sistema experto de recomendación de juegos
            </p>
          </div>
          <Shield className="w-8 h-8 text-blue-200" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.sublabel}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acceso Rápido</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`flex flex-col items-center p-4 rounded-lg bg-gradient-to-r ${action.color} text-white transition-all hover:shadow-lg hover:scale-105 text-center`}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs opacity-90 mt-1">{action.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`${activity.color} p-2 rounded-lg`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Games */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Juegos Más Recomendados</h3>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {topGames.map((game, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:from-gray-100 hover:to-blue-100 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  #{index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{game.title}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {game.recommendations} recomendaciones
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">{game.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
