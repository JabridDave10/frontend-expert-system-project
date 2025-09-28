import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  FileText,
  Search,
  User,
  ArrowLeft,
  Check,
  Phone,
  CreditCard,
  X
} from 'lucide-react';
import { createCita, type CitaCreate } from '../api/citas';
import { searchPatients, type User as UserType } from '../api/users';
import { useAuth } from '../contexts/AuthContext';
import AvailabilityCalendar from '../components/Schedule/AvailabilityCalendar';
import { type TimeSlot } from '../api/schedules';

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

  // Estados para el calendario de disponibilidad
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

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

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset slot selection
    setCitaData(prev => ({ ...prev, fecha: date, hora: '' }));

    // Limpiar errores
    if (errors.fecha) {
      setErrors(prev => ({ ...prev, fecha: '', hora: '' }));
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    console.log(`🕐 FRONTEND: User selected slot:`, slot);
    console.log(`✅ FRONTEND: Closing calendar automatically`);

    setSelectedSlot(slot);
    setShowCalendar(false); // Auto-close calendar after selection
    setCitaData(prev => ({
      ...prev,
      hora: slot.start_time.slice(0, 5) // Format HH:MM
    }));

    // Limpiar error de hora
    if (errors.hora) {
      setErrors(prev => ({ ...prev, hora: '' }));
    }
  };


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedPatient) {
      newErrors.paciente = 'Debe seleccionar un paciente';
    }

    if (!selectedDate) {
      newErrors.fecha = 'Debe seleccionar una fecha';
    }

    if (!selectedSlot) {
      newErrors.hora = 'Debe seleccionar un horario disponible';
    }

    if (!citaData.motivo.trim()) {
      newErrors.motivo = 'El motivo es requerido';
    }

    // Validar que la fecha no sea en el pasado
    if (selectedDate) {
      const today = new Date().toISOString().split('T')[0];

      if (selectedDate < today) {
        newErrors.fecha = 'La fecha debe ser hoy o en el futuro';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm() || !user || !selectedPatient || !selectedSlot) {
      return;
    }

    setIsSubmitting(true);

    try {
      // CORREGIR: selectedSlot.start_time ya incluye segundos (16:00:00)
      // Solo necesitamos agregar milisegundos
      const fechaHora = `${selectedDate}T${selectedSlot.start_time}.000`;

      console.log('📅 Creating appointment:', {
        selectedDate,
        selectedSlot: selectedSlot.start_time,
        fechaHora,
        patient: selectedPatient?.id_user,
        doctor: user.id
      });

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">Programa una nueva cita médica para tus pacientes</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al Dashboard
        </button>
      </div>

      {/* Content */}
      <div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Búsqueda de Paciente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                👤 Paso 1: Buscar y Seleccionar Paciente
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

            {/* Fecha y Hora con Calendar de Disponibilidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                📅 Paso 2: Seleccionar Fecha y Hora
              </label>

              {/* Estado actual */}
              <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                {!selectedDate && !selectedSlot ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Necesitas seleccionar una fecha y hora para la cita</p>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(true)}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Ver Horarios Disponibles
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-900 mb-2">✅ Cita Programada</h4>
                        <p className="text-green-800">
                          <strong>Fecha:</strong> {selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'No seleccionada'}
                        </p>
                        <p className="text-green-800">
                          <strong>Hora:</strong> {selectedSlot ? `${selectedSlot.start_time.slice(0, 5)} - ${selectedSlot.end_time.slice(0, 5)}` : 'No seleccionada'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDate('');
                          setSelectedSlot(null);
                          setShowCalendar(true);
                        }}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Errores */}
              {(errors.fecha || errors.hora) && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  {errors.fecha && <p className="text-sm text-red-600">❌ {errors.fecha}</p>}
                  {errors.hora && <p className="text-sm text-red-600">❌ {errors.hora}</p>}
                </div>
              )}

              {/* Calendario de Disponibilidad */}
              {showCalendar && user && (
                <div className="mb-6 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Selecciona tu horario preferido</h4>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <AvailabilityCalendar
                    doctorId={user.id}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onSlotSelect={handleSlotSelect}
                  />
                </div>
              )}
            </div>

            {/* Motivo */}
            <div>
              <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-4">
                📝 Paso 3: Motivo de la Consulta
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
                disabled={isSubmitting || !selectedPatient || !selectedSlot}
                className={`flex-1 px-6 py-3 text-white rounded-lg transition-colors flex items-center justify-center ${
                  isSubmitting || !selectedPatient || !selectedSlot
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