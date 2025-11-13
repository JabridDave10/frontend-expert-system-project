import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Shield,
  Settings,
  BarChart3,
  Activity,
  Database,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Brain
} from 'lucide-react';

interface AdminStats {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface SystemAlert {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'error' | 'info';
  time: string;
}

const AdminDashboard: React.FC = () => {
  const adminStats: AdminStats[] = [
    {
      title: 'Total Usuarios',
      value: '1,247',
      change: '+15.3%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Doctores Activos',
      value: '89',
      change: '+8.2%',
      icon: Shield,
      color: 'bg-green-500'
    },
    {
      title: 'Pacientes Registrados',
      value: '1,158',
      change: '+12.7%',
      icon: UserPlus,
      color: 'bg-purple-500'
    },
    {
      title: 'Citas Totales Hoy',
      value: '156',
      change: '+5.1%',
      icon: Activity,
      color: 'bg-orange-500'
    }
  ];

  const systemAlerts: SystemAlert[] = [
    {
      id: '1',
      title: 'Mantenimiento Programado',
      description: 'Mantenimiento del servidor programado para mañana a las 2:00 AM',
      type: 'info',
      time: 'Hace 30 min'
    },
    {
      id: '2',
      title: 'Alto Uso de CPU',
      description: 'El servidor web está usando el 85% de CPU',
      type: 'warning',
      time: 'Hace 1 hora'
    },
    {
      id: '3',
      title: 'Fallo de Backup',
      description: 'El backup automático falló esta madrugada',
      type: 'error',
      time: 'Hace 3 horas'
    }
  ];

  const quickAdminActions = [
    {
      title: 'Gestionar Usuarios',
      description: 'Ver, editar y administrar usuarios del sistema',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
      link: null
    },
    {
      title: 'Sistema Experto',
      description: 'Administrar juegos y reglas del sistema experto',
      icon: Brain,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      link: '/dashboard/admin'
    },
    {
      title: 'Configuración Sistema',
      description: 'Configurar parámetros del sistema',
      icon: Settings,
      color: 'bg-gray-500 hover:bg-gray-600',
      link: null
    },
    {
      title: 'Reportes Analytics',
      description: 'Ver reportes detallados y analytics',
      icon: BarChart3,
      color: 'bg-green-500 hover:bg-green-600',
      link: null
    },
    {
      title: 'Base de Datos',
      description: 'Administrar y monitorear base de datos',
      icon: Database,
      color: 'bg-purple-500 hover:bg-purple-600',
      link: null
    }
  ];

  const recentUserActivity = [
    {
      id: '1',
      user: 'Dr. Juan Pérez',
      action: 'Inició sesión',
      time: 'Hace 5 min',
      status: 'success'
    },
    {
      id: '2',
      user: 'María González',
      action: 'Registró nueva cuenta',
      time: 'Hace 15 min',
      status: 'success'
    },
    {
      id: '3',
      user: 'Admin Carlos',
      action: 'Modificó configuración',
      time: 'Hace 30 min',
      status: 'warning'
    },
    {
      id: '4',
      user: 'Dr. Ana López',
      action: 'Falló inicio de sesión',
      time: 'Hace 1 hora',
      status: 'error'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Panel de Administración</h2>
            <p className="text-indigo-100">
              Monitorea y administra todos los aspectos del sistema MedCitas
            </p>
          </div>
          <Shield className="w-8 h-8 text-indigo-200" />
        </div>
      </div>

      {/* Admin Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => {
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

      {/* Main Admin Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Admin Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Administración Rápida</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickAdminActions.map((action, index) => {
              const Icon = action.icon;
              const content = (
                <>
                  <Icon className="w-6 h-6 mb-2" />
                  <p className="font-medium text-sm">{action.title}</p>
                </>
              );

              return action.link ? (
                <Link
                  key={index}
                  to={action.link}
                  className={`flex flex-col items-center p-4 rounded-lg ${action.color} text-white transition-colors text-center`}
                >
                  {content}
                </Link>
              ) : (
                <button
                  key={index}
                  className={`flex flex-col items-center p-4 rounded-lg ${action.color} text-white transition-colors text-center`}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas del Sistema</h3>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-500">{alert.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs text-gray-400">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Ver todas las alertas
          </button>
        </div>
      </div>

      {/* Recent User Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente de Usuarios</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Usuario</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Acción</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Tiempo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentUserActivity.map((activity) => (
                <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{activity.user}</td>
                  <td className="py-3 px-4">{activity.action}</td>
                  <td className="py-3 px-4 text-gray-500">{activity.time}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {getStatusIcon(activity.status)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="w-full mt-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          Ver todo el registro de actividad
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;