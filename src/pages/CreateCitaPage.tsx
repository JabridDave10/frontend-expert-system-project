import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  FileText,
  Search,
  User,
  ArrowLeft,
  Check,
  Phone,
  CreditCard
} from 'lucide-react';
import { createCita, type CitaCreate } from '../api/citas';
import { searchPatients, type User as UserType } from '../api/users';
import { useAuth } from '../contexts/AuthContext';

const CreateCitaPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados para el formulario
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<UserType[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<UserType | null>(null);
  const [showPatientList, setShowPatientList] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Estados para los datos de la cita
  const [citaData, setCitaData] = useState({
    fecha: '',
    hora: '',
    motivo: '',
    estado: 'programada'
  });

  // Estados para manejo de errores y carga
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Buscar pacientes cuando cambie el término de búsqueda
  useEffect(() => {
    const searchPatientsDebounced = async () => {
      if (searchTerm.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchPatients(searchTerm);
          setPatients(results);
          setShowPatientList(true);
        } catch (error) {
          console.error('Error buscando pacientes:', error);
          setPatients([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setPatients([]);
        setShowPatientList(false);
      }
    };

    const timeoutId = setTimeout(searchPatientsDebounced, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePatientSelect = (patient: UserType) => {
    setSelectedPatient(patient);
    setSearchTerm(`${patient.firstName} ${patient.lastName}`);
    setShowPatientList(false);
    // Limpiar error si había uno
    if (errors.paciente) {
      setErrors(prev => ({ ...prev, paciente: '' }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCitaData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedPatient) {
      newErrors.paciente = 'Debe seleccionar un paciente';
    }

    if (!citaData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    if (!citaData.hora) {
      newErrors.hora = 'La hora es requerida';
    }

    if (!citaData.motivo.trim()) {
      newErrors.motivo = 'El motivo es requerido';
    }

    // Validar que la fecha no sea en el pasado
    if (citaData.fecha && citaData.hora) {
      const selectedDateTime = new Date(`${citaData.fecha}T${citaData.hora}`);
      const now = new Date();
      if (selectedDateTime <= now) {
        newErrors.fecha = 'La fecha y hora deben ser futuras';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm() || !user || !selectedPatient) {
      return;
    }

    setIsSubmitting(true);

    try {
      const fechaHora = new Date(`${citaData.fecha}T${citaData.hora}`).toISOString();

      const citaCreateData: CitaCreate = {
        fecha_hora: fechaHora,
        motivo: citaData.motivo.trim(),
        estado: citaData.estado,
        id_paciente: selectedPatient.id_user,
        id_doctor: user.id
      };

      await createCita(citaCreateData);

      // Redirigir de vuelta al dashboard con mensaje de éxito
      navigate('/dashboard', {
        state: {
          successMessage: 'Cita creada exitosamente'
        }
      });

    } catch (error) {
      console.error('Error al crear cita:', error);
      setSubmitError(error instanceof Error ? error.message : 'Error al crear la cita');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Dashboard
              </button>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Nueva Cita Médica</h1>
            <div className="w-32" /> {/* Spacer para centrar el título */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Búsqueda de Paciente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Paciente
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o cédula..."
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                      errors.paciente ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-3">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-teal-500 rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Lista de pacientes */}
                {showPatientList && patients.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {patients.map((patient) => (
                      <button
                        key={patient.id_user}
                        type="button"
                        onClick={() => handlePatientSelect(patient)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <CreditCard className="w-4 h-4 mr-1" />
                                {patient.identification}
                              </span>
                              {patient.phone && (
                                <span className="flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  {patient.phone}
                                </span>
                              )}
                            </div>
                          </div>
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No hay resultados */}
                {showPatientList && patients.length === 0 && searchTerm.length >= 2 && !isSearching && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                    No se encontraron pacientes
                  </div>
                )}
              </div>

              {errors.paciente && (
                <p className="mt-1 text-sm text-red-600">{errors.paciente}</p>
              )}

              {/* Paciente seleccionado */}
              {selectedPatient && (
                <div className="mt-3 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-teal-900">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-teal-700">
                        <span className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-1" />
                          {selectedPatient.identification}
                        </span>
                        <span>{selectedPatient.email}</span>
                        {selectedPatient.phone && (
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {selectedPatient.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPatient(null);
                        setSearchTerm('');
                      }}
                      className="text-teal-600 hover:text-teal-800 transition-colors"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    id="fecha"
                    value={citaData.fecha}
                    onChange={(e) => handleInputChange('fecha', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                      errors.fecha ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                {errors.fecha && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha}</p>
                )}
              </div>

              <div>
                <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-2">
                  Hora
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="time"
                    id="hora"
                    value={citaData.hora}
                    onChange={(e) => handleInputChange('hora', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                      errors.hora ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                {errors.hora && (
                  <p className="mt-1 text-sm text-red-600">{errors.hora}</p>
                )}
              </div>
            </div>

            {/* Motivo */}
            <div>
              <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de la Consulta
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="motivo"
                  value={citaData.motivo}
                  onChange={(e) => handleInputChange('motivo', e.target.value)}
                  placeholder="Describe el motivo de la consulta..."
                  rows={4}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none ${
                    errors.motivo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
              {errors.motivo && (
                <p className="mt-1 text-sm text-red-600">{errors.motivo}</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                id="estado"
                value={citaData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              >
                <option value="programada">Programada</option>
                <option value="confirmada">Confirmada</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedPatient}
                className={`flex-1 px-6 py-3 text-white rounded-lg transition-colors flex items-center justify-center ${
                  isSubmitting || !selectedPatient
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Crear Cita
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCitaPage;