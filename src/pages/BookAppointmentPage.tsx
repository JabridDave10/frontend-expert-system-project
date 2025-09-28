import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usersApi, type User as UserType } from '../api/users';
import { schedulesApi, type TimeSlot } from '../api/schedules';
import { citasApi, type CitaCreate } from '../api/citas';
import AvailabilityCalendar from '../components/Schedule/AvailabilityCalendar';

const BookAppointmentPage: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<'select-doctor' | 'select-date' | 'select-time' | 'confirm'>('select-doctor');
  const [doctors, setDoctors] = useState<UserType[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<UserType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getUsersByRole(2); // Role 2 = doctors
      setDoctors(response);
    } catch (error) {
      console.error('Error loading doctors:', error);
      alert('Error al cargar los doctores');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDoctorSelect = (doctor: UserType) => {
    setSelectedDoctor(doctor);
    setStep('select-date');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep('select-time');
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('confirm');
  };

  const handleConfirmAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot || !user) {
      alert('Faltan datos para crear la cita');
      return;
    }

    try {
      setLoading(true);

      // Crear fecha y hora en formato ISO
      const fechaHora = `${selectedDate}T${selectedSlot.start_time}:00`;

      const citaData: CitaCreate = {
        fecha_hora: fechaHora,
        motivo: reason || 'Consulta médica',
        estado: 'programada',
        id_paciente: user.id,
        id_doctor: selectedDoctor.id_user
      };

      await citasApi.createCita(citaData);

      alert('¡Cita agendada exitosamente!');

      // Reset form
      setStep('select-doctor');
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedSlot(null);
      setReason('');

    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Error al agendar la cita. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    switch (step) {
      case 'select-date':
        setStep('select-doctor');
        setSelectedDoctor(null);
        break;
      case 'select-time':
        setStep('select-date');
        setSelectedDate('');
        break;
      case 'confirm':
        setStep('select-time');
        setSelectedSlot(null);
        break;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T12:00:00').toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // HH:MM format
  };

  if (!user || user.id_role !== 1) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Solo los pacientes pueden acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {step !== 'select-doctor' && (
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendar Cita Médica</h1>
          <p className="text-gray-600">Programa tu consulta con el doctor de tu preferencia</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[
          { key: 'select-doctor', label: 'Seleccionar Doctor', icon: User },
          { key: 'select-date', label: 'Seleccionar Fecha', icon: Calendar },
          { key: 'select-time', label: 'Seleccionar Hora', icon: Clock },
          { key: 'confirm', label: 'Confirmar', icon: Calendar }
        ].map((stepItem, index) => {
          const Icon = stepItem.icon;
          const isActive = step === stepItem.key;
          const isCompleted = ['select-doctor', 'select-date', 'select-time', 'confirm'].indexOf(step) > index;

          return (
            <div key={stepItem.key} className="flex items-center gap-2">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2
                ${isActive ? 'border-blue-500 bg-blue-500 text-white' :
                  isCompleted ? 'border-green-500 bg-green-500 text-white' :
                  'border-gray-300 text-gray-500'}
              `}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {stepItem.label}
              </span>
              {index < 3 && <div className="w-8 h-px bg-gray-300" />}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {step === 'select-doctor' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Selecciona un Doctor</h2>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar doctor por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.map(doctor => (
                  <div
                    key={doctor.id_user}
                    onClick={() => handleDoctorSelect(doctor)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Dr. {doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'select-date' && selectedDoctor && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Selecciona una Fecha - Dr. {selectedDoctor.name}
            </h2>
            <AvailabilityCalendar
              doctorId={selectedDoctor.id_user}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onSlotSelect={() => {}} // No action on slot select in this step
            />
          </div>
        )}

        {step === 'select-time' && selectedDoctor && selectedDate && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Selecciona una Hora - {formatDate(selectedDate)}
            </h2>
            <AvailabilityCalendar
              doctorId={selectedDoctor.id_user}
              selectedDate={selectedDate}
              onDateSelect={() => {}} // No action on date select in this step
              onSlotSelect={handleSlotSelect}
            />
          </div>
        )}

        {step === 'confirm' && selectedDoctor && selectedDate && selectedSlot && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Confirmar Cita</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Appointment Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                  <p className="text-gray-900">Dr. {selectedDoctor.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <p className="text-gray-900">{formatDate(selectedDate)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <p className="text-gray-900">{formatTime(selectedSlot.start_time)}</p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de la consulta (opcional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe brevemente el motivo de tu consulta..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleConfirmAppointment}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Agendando...' : 'Confirmar Cita'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointmentPage;