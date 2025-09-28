import React, { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';
import { schedulesApi, type DoctorSettings } from '../../api/schedules';

interface ScheduleSettingsProps {
  doctorId: number;
  onSettingsChange?: () => void;
}

const ScheduleSettings: React.FC<ScheduleSettingsProps> = ({ doctorId, onSettingsChange }) => {
  const [settings, setSettings] = useState<DoctorSettings>({
    appointment_duration: 30,
    break_between_appointments: 5,
    advance_booking_days: 30,
    allow_weekend_appointments: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [doctorId]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await schedulesApi.getDoctorSettings(doctorId);
      setSettings(response);
    } catch (error) {
      console.error('Error loading settings:', error);
      // Mantener valores por defecto si hay error
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await schedulesApi.updateDoctorSettings(doctorId, settings);
      onSettingsChange?.();
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (field: keyof DoctorSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Configuración de Citas</h3>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duración de citas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración de cada cita (minutos)
          </label>
          <select
            value={settings.appointment_duration}
            onChange={(e) => updateSetting('appointment_duration', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={15}>15 minutos</option>
            <option value={20}>20 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={45}>45 minutos</option>
            <option value={60}>1 hora</option>
          </select>
        </div>

        {/* Tiempo entre citas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiempo entre citas (minutos)
          </label>
          <select
            value={settings.break_between_appointments}
            onChange={(e) => updateSetting('break_between_appointments', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Sin descanso</option>
            <option value={5}>5 minutos</option>
            <option value={10}>10 minutos</option>
            <option value={15}>15 minutos</option>
          </select>
        </div>

        {/* Días de anticipación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Días máximos para agendar con anticipación
          </label>
          <input
            type="number"
            min={1}
            max={365}
            value={settings.advance_booking_days}
            onChange={(e) => updateSetting('advance_booking_days', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Citas en fines de semana */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.allow_weekend_appointments}
              onChange={(e) => updateSetting('allow_weekend_appointments', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Permitir citas en fines de semana
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Si está habilitado, los pacientes podrán agendar citas los sábados y domingos
          </p>
        </div>
      </div>

      {/* Resumen de configuración */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Resumen de configuración:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Cada cita durará {settings.appointment_duration} minutos</li>
          <li>• Habrá {settings.break_between_appointments} minutos entre citas</li>
          <li>• Los pacientes pueden agendar hasta {settings.advance_booking_days} días por adelantado</li>
          <li>• Citas en fines de semana: {settings.allow_weekend_appointments ? 'Permitidas' : 'No permitidas'}</li>
        </ul>
      </div>
    </div>
  );
};

export default ScheduleSettings;