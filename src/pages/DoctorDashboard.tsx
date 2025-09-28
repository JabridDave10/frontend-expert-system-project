import React from 'react';
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

interface Appointment {
  id: string;
  patient: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed';
  duration: string;
}

const DoctorDashboard: React.FC = () => {
  const doctorStats: DoctorStats[] = [
    {
      title: 'Citas Hoy',
      value: '8',
      change: '+12.5%',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Pacientes Activos',
      value: '142',
      change: '+8.3%',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Consultas Pendientes',
      value: '3',
      change: '-15.2%',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Historiales Actualizados',
      value: '5',
      change: '+25.0%',
      icon: FileText,
      color: 'bg-purple-500'
    }
  ];

  const todayAppointments: Appointment[] = [
    {
      id: '1',
      patient: 'Ana García',
      time: '09:00',
      type: 'Consulta General',
      status: 'confirmed',
      duration: '30 min'
    },
    {
      id: '2',
      patient: 'Carlos Ruiz',
      time: '10:30',
      type: 'Seguimiento',
      status: 'confirmed',
      duration: '20 min'
    },
    {
      id: '3',
      patient: 'María Fernández',
      time: '11:15',
      type: 'Primera Consulta',
      status: 'pending',
      duration: '45 min'
    },
    {
      id: '4',
      patient: 'José López',
      time: '14:00',
      type: 'Control Post-op',
      status: 'confirmed',
      duration: '25 min'
    }
  ];

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
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Agregar Paciente',
      description: 'Registrar nuevo paciente',
      icon: UserCheck,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Crear Receta',
      description: 'Generar receta médica',
      icon: FileText,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Consulta Virtual',
      description: 'Iniciar videollamada',
      icon: Phone,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
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
      {/* Doctor Welcome Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Panel Médico</h2>
            <p className="text-teal-100">
              Tienes 8 citas programadas hoy • 3 pacientes críticos requieren atención
            </p>
          </div>
          <Stethoscope className="w-8 h-8 text-teal-200" />
        </div>
      </div>

      {/* Doctor Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                    <p className="text-sm text-gray-500">{appointment.type} • {appointment.duration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600">{appointment.time}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status === 'confirmed' ? 'Confirmada' :
                     appointment.status === 'pending' ? 'Pendiente' : 'Completada'}
                  </span>
                </div>
              </div>
            ))}
          </div>
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