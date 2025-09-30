import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getCitasByDoctor, type CitaResponse } from '../api/citas';
import { getUserById, type User as UserType } from '../api/users';
import { useAuth } from '../contexts/AuthContext';
import MedicalRecordButton from '../components/MedicalRecordButton';

interface CitaWithPatient extends CitaResponse {
  pacienteInfo?: UserType;
}

const CitasPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados
  const [citas, setCitas] = useState<CitaWithPatient[]>([]);
  const [filteredCitas, setFilteredCitas] = useState<CitaWithPatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  

  // Cargar citas del doctor
  const loadCitas = async () => {
    if (!user) return;

    setIsLoading(true);
    setError('');

    try {
      console.log(`Cargando citas para doctor ID: ${user.id}`);
      const citasData = await getCitasByDoctor(user.id);

      // Obtener información de cada paciente
      const citasWithPatients = await Promise.all(
        citasData.map(async (cita) => {
          try {
            const pacienteInfo = await getUserById(cita.id_paciente);
            return { ...cita, pacienteInfo };
          } catch (error) {
            console.warn(`No se pudo cargar información del paciente ${cita.id_paciente}:`, error);
            return cita;
          }
        })
      );

      setCitas(citasWithPatients);
      setFilteredCitas(citasWithPatients);
    } catch (error: any) {
      console.error('Error cargando citas:', error);
      setError('Error al cargar las citas. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCitas();
  }, [user]);

  // Filtrar citas cuando cambie el término de búsqueda o filtro de estado
  useEffect(() => {
    let filtered = citas;

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(cita =>
        cita.pacienteInfo?.firstName.toLowerCase().includes(search) ||
        cita.pacienteInfo?.lastName.toLowerCase().includes(search) ||
        cita.motivo?.toLowerCase().includes(search) ||
        cita.pacienteInfo?.identification.includes(search)
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cita => cita.estado === statusFilter);
    }

    setFilteredCitas(filtered);
  }, [citas, searchTerm, statusFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'programada':
        return 'bg-blue-100 text-blue-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'completada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmada':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'programada':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'pendiente':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'cancelada':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completada':
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Cargando citas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">Gestiona y revisa tus citas médicas</p>
        </div>
        <button
          onClick={() => navigate('/crear-cita')}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cita
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por paciente, motivo o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="programada">Programadas</option>
              <option value="confirmada">Confirmadas</option>
              <option value="pendiente">Pendientes</option>
              <option value="completada">Completadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: citas.length, color: 'bg-blue-500' },
          { label: 'Hoy', count: citas.filter(c => new Date(c.fecha_hora).toDateString() === new Date().toDateString()).length, color: 'bg-green-500' },
          { label: 'Pendientes', count: citas.filter(c => c.estado === 'pendiente').length, color: 'bg-yellow-500' },
          { label: 'Confirmadas', count: citas.filter(c => c.estado === 'confirmada').length, color: 'bg-teal-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className={`${stat.color} w-3 h-3 rounded-full mr-3`} />
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lista de citas */}
      {filteredCitas.length === 0 ? (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay citas</h3>
          <p className="text-gray-600 mb-4">
            {citas.length === 0
              ? 'Aún no tienes citas programadas.'
              : 'No se encontraron citas que coincidan con los filtros aplicados.'
            }
          </p>
          <button
            onClick={() => navigate('/crear-cita')}
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Cita
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCitas.map((cita) => (
                  <tr key={cita.id_cita} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {cita.pacienteInfo ?
                              `${cita.pacienteInfo.firstName} ${cita.pacienteInfo.lastName}` :
                              `Paciente ID: ${cita.id_paciente}`
                            }
                          </p>
                          {cita.pacienteInfo && (
                            <p className="text-sm text-gray-500">
                              {cita.pacienteInfo.identification}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(cita.fecha_hora)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatTime(cita.fecha_hora)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 max-w-xs truncate">
                        {cita.motivo || 'Sin motivo especificado'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(cita.estado)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(cita.estado)}`}>
                          {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <MedicalRecordButton
                          appointmentDate={cita.fecha_hora}
                          appointmentId={cita.id_cita}
                          patientId={cita.id_paciente}
                          patientName={cita.pacienteInfo ? `${cita.pacienteInfo.firstName} ${cita.pacienteInfo.lastName}` : undefined}
                          patientInfo={cita.pacienteInfo ? {
                            firstName: cita.pacienteInfo.firstName,
                            lastName: cita.pacienteInfo.lastName,
                            identification: cita.pacienteInfo.identification,
                            phone: cita.pacienteInfo.phone,
                            email: cita.pacienteInfo.email,
                            dateofbirth: cita.pacienteInfo.dateofbirth,
                            gender: cita.pacienteInfo.gender
                          } : undefined}
                          // hasMedicalHistory se verifica automáticamente en el componente
                        />
                        <button className="text-teal-600 hover:text-teal-900" title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900" title="Editar cita">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Eliminar cita">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default CitasPage;