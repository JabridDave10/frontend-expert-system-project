import React from 'react';
import {
  Calendar,
  Users,
  FileText,
  Clock,
  TrendingUp,
  Activity,
  Bell,
  Plus
} from 'lucide-react';

interface DashboardStats {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'appointment' | 'patient' | 'report';
}

const DashboardPage: React.FC = () => {
  // Mock data - en un proyecto real esto vendría de una API
  const stats: DashboardStats[] = [
    {
      title: 'Citas Hoy',
      value: '12',
      change: '+2.5%',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Pacientes Activos',
      value: '248',
      change: '+12.3%',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Reportes Pendientes',
      value: '5',
      change: '-8.1%',
      icon: FileText,
      color: 'bg-yellow-500'
    },
    {
      title: 'Tiempo Promedio',
      value: '24min',
      change: '+1.2%',
      icon: Clock,
      color: 'bg-purple-500'
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      title: 'Nueva cita programada',
      description: 'Juan Pérez - Consulta general',
      time: 'Hace 5 min',
      type: 'appointment'
    },
    {
      id: '2',
      title: 'Paciente registrado',
      description: 'María González se registró en el sistema',
      time: 'Hace 15 min',
      type: 'patient'
    },
    {
      id: '3',
      title: 'Reporte completado',
      description: 'Análisis mensual de consultas',
      time: 'Hace 1 hora',
      type: 'report'
    },
    {
      id: '4',
      title: 'Cita cancelada',
      description: 'Carlos Rodríguez - Cita del 15/03',
      time: 'Hace 2 horas',
      type: 'appointment'
    }
  ];

  const quickActions = [
    {
      title: 'Nueva Cita',
      description: 'Programar una nueva cita médica',
      icon: Calendar,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Registrar Paciente',
      description: 'Agregar nuevo paciente al sistema',
      icon: Users,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Crear Reporte',
      description: 'Generar reporte médico',
      icon: FileText,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido de vuelta!</h2>
            <p className="text-cyan-100">
              Tienes 3 citas programadas para hoy y 2 notificaciones pendientes.
            </p>
          </div>
          <Bell className="w-8 h-8 text-cyan-200" />
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
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className={`w-full flex items-center p-3 rounded-lg ${action.color} text-white transition-colors`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                  <Plus className="w-4 h-4 ml-auto" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-cyan-600 hover:text-cyan-700 font-medium">
            Ver toda la actividad
          </button>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Citas</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Paciente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Hora</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">Juan Pérez</td>
                <td className="py-3 px-4">Hoy</td>
                <td className="py-3 px-4">10:00 AM</td>
                <td className="py-3 px-4">Consulta General</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Confirmada
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">María González</td>
                <td className="py-3 px-4">Hoy</td>
                <td className="py-3 px-4">2:30 PM</td>
                <td className="py-3 px-4">Cardiología</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Pendiente
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">Carlos Rodríguez</td>
                <td className="py-3 px-4">Mañana</td>
                <td className="py-3 px-4">9:15 AM</td>
                <td className="py-3 px-4">Dermatología</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Programada
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;