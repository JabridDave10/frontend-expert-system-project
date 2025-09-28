import React from 'react';
import {
  Calendar,
  Heart,
  FileText,
  Clock,
  User,
  Phone,
  MapPin,
  Activity,
  Plus,
  Bell,
  Pill,
  AlertCircle
} from 'lucide-react';

interface PatientStats {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed';
}

interface HealthMetric {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'alert';
  lastUpdated: string;
}

const PatientDashboard: React.FC = () => {
  const patientStats: PatientStats[] = [
    {
      title: 'Próximas Citas',
      value: '2',
      change: 'Esta semana',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Historial Médico',
      value: '12',
      change: 'Consultas totales',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Medicamentos',
      value: '3',
      change: 'Activos',
      icon: Pill,
      color: 'bg-purple-500'
    },
    {
      title: 'Estado General',
      value: 'Bueno',
      change: 'Última revisión',
      icon: Heart,
      color: 'bg-red-500'
    }
  ];

  const upcomingAppointments: Appointment[] = [
    {
      id: '1',
      doctor: 'Dr. Ana López',
      specialty: 'Cardiología',
      date: 'Mañana',
      time: '10:30 AM',
      location: 'Consultorio 205',
      status: 'confirmed'
    },
    {
      id: '2',
      doctor: 'Dr. Carlos Ruiz',
      specialty: 'Medicina General',
      date: '15 Mar 2024',
      time: '2:00 PM',
      location: 'Consultorio 102',
      status: 'confirmed'
    },
    {
      id: '3',
      doctor: 'Dr. María Fernández',
      specialty: 'Dermatología',
      date: '22 Mar 2024',
      time: '11:15 AM',
      location: 'Consultorio 301',
      status: 'pending'
    }
  ];

  const healthMetrics: HealthMetric[] = [
    {
      name: 'Presión Arterial',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal',
      lastUpdated: 'Hace 2 días'
    },
    {
      name: 'Frecuencia Cardíaca',
      value: '72',
      unit: 'bpm',
      status: 'normal',
      lastUpdated: 'Hace 2 días'
    },
    {
      name: 'Peso',
      value: '68.5',
      unit: 'kg',
      status: 'normal',
      lastUpdated: 'Hace 1 semana'
    },
    {
      name: 'Glucosa',
      value: '95',
      unit: 'mg/dL',
      status: 'normal',
      lastUpdated: 'Hace 3 días'
    }
  ];

  const medications = [
    {
      name: 'Omeprazol',
      dosage: '20mg',
      frequency: 'Una vez al día',
      timeLeft: '15 días',
      status: 'active'
    },
    {
      name: 'Ibuprofeno',
      dosage: '400mg',
      frequency: 'Según necesidad',
      timeLeft: '30 días',
      status: 'active'
    },
    {
      name: 'Vitamina D',
      dosage: '1000 UI',
      frequency: 'Una vez al día',
      timeLeft: '45 días',
      status: 'active'
    }
  ];

  const quickPatientActions = [
    {
      title: 'Agendar Cita',
      description: 'Programar nueva cita médica',
      icon: Calendar,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Consulta Virtual',
      description: 'Iniciar teleconsulta',
      icon: Phone,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Mis Recetas',
      description: 'Ver recetas médicas',
      icon: FileText,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Recordatorios',
      description: 'Configurar alertas',
      icon: Bell,
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

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'alert':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <Heart className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Welcome Section */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Mi Panel de Salud</h2>
            <p className="text-rose-100">
              Tienes 2 citas próximas • Tu próxima cita es mañana a las 10:30 AM
            </p>
          </div>
          <User className="w-8 h-8 text-rose-200" />
        </div>
      </div>

      {/* Patient Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {patientStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-600">{stat.change}</span>
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
            {quickPatientActions.map((action, index) => {
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

        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Citas</h3>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{appointment.doctor}</p>
                      <p className="text-sm text-gray-500">{appointment.specialty}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status === 'confirmed' ? 'Confirmada' :
                     appointment.status === 'pending' ? 'Pendiente' : 'Completada'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{appointment.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-rose-600 hover:text-rose-700 font-medium">
            Ver historial completo
          </button>
        </div>
      </div>

      {/* Health Metrics & Medications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Metrics */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Signos Vitales</h3>
          <div className="space-y-4">
            {healthMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getHealthStatusIcon(metric.status)}
                  <div>
                    <p className="font-medium text-gray-900">{metric.name}</p>
                    <p className="text-sm text-gray-500">{metric.lastUpdated}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getHealthStatusColor(metric.status)}`}>
                    {metric.value} {metric.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-rose-600 hover:text-rose-700 font-medium">
            Ver historial completo
          </button>
        </div>

        {/* Current Medications */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medicamentos Actuales</h3>
          <div className="space-y-3">
            {medications.map((med, index) => (
              <div key={index} className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{med.name}</p>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Activo
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{med.dosage} • {med.frequency}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Quedan: {med.timeLeft}</p>
                  <button className="text-xs text-rose-600 hover:text-rose-700 font-medium">
                    Renovar receta
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-rose-600 hover:text-rose-700 font-medium">
            Ver todas las recetas
          </button>
        </div>
      </div>

      {/* Recent Activity & Tips */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Consejos de Salud</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <Heart className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-blue-900 mb-1">Ejercicio Regular</h4>
            <p className="text-sm text-blue-700">30 minutos de actividad física al día pueden mejorar significativamente tu salud cardiovascular.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <Pill className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium text-green-900 mb-1">Toma tus Medicamentos</h4>
            <p className="text-sm text-green-700">No olvides tomar tus medicamentos según las indicaciones médicas para mejores resultados.</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-purple-900 mb-1">Chequeos Regulares</h4>
            <p className="text-sm text-purple-700">Mantén tus citas médicas al día para una detección temprana de cualquier problema.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;