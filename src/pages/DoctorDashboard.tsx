import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDashboardStats, getTodayAppointments, type DashboardStats as DashboardStatsType, type TodayAppointment } from '../api/citas';
import {
  Calendar,
  Users,
  Clock,
  FileText,
  Stethoscope,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Plus,
  Phone,
  Star
} from 'lucide-react';

interface DoctorStats {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  lastVisit: string;
  status: 'stable' | 'critical' | 'improving';
}


const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsType | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar estadísticas del dashboard y citas de hoy
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [stats, appointments] = await Promise.all([
          getDashboardStats(),
          getTodayAppointments()
        ]);
        setDashboardStats(stats);
        setTodayAppointments(appointments);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Manejar mensaje de éxito desde la navegación
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Limpiar el estado después de mostrarlo
      window.history.replaceState({}, document.title);
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location.state]);
  const doctorStats: DoctorStats[] = [
    {
      title: 'Citas Hoy',
      value: loading ? '...' : (dashboardStats?.today_appointments.toString() || '0'),
      change: '+12.5%',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Pacientes Activos',
      value: loading ? '...' : (dashboardStats?.active_patients.toString() || '0'),
      change: '+8.3%',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Consultas Pendientes',
      value: loading ? '...' : (dashboardStats?.pending_appointments.toString() || '0'),
      change: '-15.2%',
      icon: Clock,
      color: 'bg-yellow-500'
    }
  ];

  // Función para formatear la hora desde datetime
  const formatTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return 'N/A';
    }
  };

  const criticalPatients: Patient[] = [
    {
      id: '1',
      name: 'Roberto Méndez',
      age: 68,
      condition: 'Hipertensión',
      lastVisit: '2 días',
      status: 'critical'
    },
    {
      id: '2',
      name: 'Elena Torres',
      age: 54,
      condition: 'Diabetes Tipo 2',
      lastVisit: '1 semana',
      status: 'stable'
    },
    {
      id: '3',
      name: 'Miguel Santos',
      age: 42,
      condition: 'Post-cirugía',
      lastVisit: '3 días',
      status: 'improving'
    }
  ];

  const quickDoctorActions = [
    {
      title: 'Nueva Cita',
      description: 'Programar cita para paciente',
      icon: Calendar,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/crear-cita')
    },
    {
      title: 'Agregar Paciente',
      description: 'Registrar nuevo paciente',
      icon: UserCheck,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => {} // Placeholder para futura funcionalidad
    },
    {
      title: 'Crear Receta',
      description: 'Generar receta médica',
      icon: FileText,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => {} // Placeholder para futura funcionalidad
    },
    {
      title: 'Consulta Virtual',
      description: 'Iniciar videollamada',
      icon: Phone,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => {} // Placeholder para futura funcionalidad
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPatientStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'stable':
        return 'bg-green-100 text-green-800';
      case 'improving':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Doctor Welcome Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Panel Médico</h2>
            <p className="text-teal-100">
              {loading ? 'Cargando...' :
               `Tienes ${dashboardStats?.today_appointments || 0} citas programadas hoy • ${dashboardStats?.pending_appointments || 0} consultas pendientes`}
            </p>
          </div>
          <Stethoscope className="w-8 h-8 text-teal-200" />
        </div>
      </div>

      {/* Doctor Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctorStats.map((stat, index) => {
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
            {quickDoctorActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
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

        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Citas de Hoy</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Cargando citas...</div>
            </div>
          ) : todayAppointments.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">No hay citas programadas para hoy</div>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.patient_name}</p>
                      <p className="text-sm text-gray-500">{appointment.reason} • {appointment.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600">{formatTime(appointment.appointment_date)}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status === 'confirmed' ? 'Confirmada' :
                       appointment.status === 'pending' ? 'Pendiente' :
                       appointment.status === 'scheduled' ? 'Programada' : 'Completada'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="w-full mt-4 py-2 text-sm text-teal-600 hover:text-teal-700 font-medium">
            Ver todas las citas
          </button>
        </div>
      </div>

      {/* Critical Patients & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Patients */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pacientes Prioritarios</h3>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-3">
            {criticalPatients.map((patient) => (
              <div key={patient.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{patient.name}</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPatientStatusColor(patient.status)}`}>
                    {patient.status === 'critical' ? 'Crítico' :
                     patient.status === 'stable' ? 'Estable' : 'Mejorando'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{patient.age} años • {patient.condition}</p>
                <p className="text-xs text-gray-500 mt-1">Última visita: {patient.lastVisit}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-teal-600 hover:text-teal-700 font-medium">
            Ver todos los pacientes
          </button>
        </div>

        {/* Doctor Performance */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento Semanal</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Citas Completadas</span>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                  <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Satisfacción Pacientes</span>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">4.8/5.0</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tiempo Promedio</span>
              <span className="text-sm font-medium">28 min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ingresos Esta Semana</span>
              <span className="text-sm font-medium text-green-600">$2,450</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-teal-50 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-teal-600 mr-2" />
              <p className="text-sm text-teal-700 font-medium">+12% más consultas que la semana pasada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;