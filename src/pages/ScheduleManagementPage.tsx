import React, { useState } from 'react';
import { Calendar, Settings, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import WeeklyScheduleGrid from '../components/Schedule/WeeklyScheduleGrid';
import ScheduleSettings from '../components/Schedule/ScheduleSettings';
import AvailabilityCalendar from '../components/Schedule/AvailabilityCalendar';

const ScheduleManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'schedule' | 'settings' | 'preview'>('schedule');

  if (!user || user.id_role !== 2) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Solo los doctores pueden acceder a esta página.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'schedule' as const, label: 'Horario Semanal', icon: Calendar },
    { id: 'settings' as const, label: 'Configuración', icon: Settings },
    { id: 'preview' as const, label: 'Vista Previa', icon: Clock }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Horarios</h1>
        <p className="text-gray-600">Configura tu horario de atención y disponibilidad</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'schedule' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Configurar Horario Semanal</h2>
              <p className="text-gray-600">
                Define los días y horarios en los que estarás disponible para atender pacientes.
              </p>
            </div>
            <WeeklyScheduleGrid
              doctorId={user.id}
              onScheduleChange={() => {
                // Refresh preview if needed
              }}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Configuración de Citas</h2>
              <p className="text-gray-600">
                Ajusta los parámetros para la duración de las citas y las opciones de reserva.
              </p>
            </div>
            <ScheduleSettings
              doctorId={user.id}
              onSettingsChange={() => {
                // Refresh preview if needed
              }}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Vista Previa de Disponibilidad</h2>
              <p className="text-gray-600">
                Visualiza cómo verán los pacientes tu disponibilidad para agendar citas.
              </p>
            </div>
            <AvailabilityCalendar
              doctorId={user.id}
              onDateSelect={(date) => {
                console.log('Selected date:', date);
              }}
              onSlotSelect={(slot) => {
                console.log('Selected slot:', slot);
              }}
            />
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Consejos para configurar tu horario:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Configura primero tu horario semanal en la pestaña "Horario Semanal"</li>
          <li>• Ajusta la duración de las citas según tu especialidad en "Configuración"</li>
          <li>• Usa la "Vista Previa" para ver cómo los pacientes verán tu disponibilidad</li>
          <li>• Puedes crear múltiples bloques de horarios para el mismo día si tienes pausas</li>
        </ul>
      </div>
    </div>
  );
};

export default ScheduleManagementPage;