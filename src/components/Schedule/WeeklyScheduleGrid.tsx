import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Save } from 'lucide-react';
import { schedulesApi, type DoctorSchedule } from '../../api/schedules';

interface WeeklyScheduleGridProps {
  doctorId: number;
  onScheduleChange?: () => void;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' }
];

const WeeklyScheduleGrid: React.FC<WeeklyScheduleGridProps> = ({ doctorId, onScheduleChange }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSchedules, setEditingSchedules] = useState<DoctorSchedule[]>([]);

  useEffect(() => {
    loadSchedules();
  }, [doctorId]);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const response = await schedulesApi.getDoctorSchedule(doctorId);
      setEditingSchedules(response.schedules);
    } catch (error) {
      console.error('Error loading schedules:', error);
      // Inicializar con horarios vacíos si no existen
      setEditingSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const addScheduleForDay = (dayOfWeek: number) => {
    const newSchedule: DoctorSchedule = {
      day_of_week: dayOfWeek,
      start_time: '09:00',
      end_time: '17:00',
      is_active: true
    };
    setEditingSchedules([...editingSchedules, newSchedule]);
  };

  const removeSchedule = (index: number) => {
    const updated = editingSchedules.filter((_, i) => i !== index);
    setEditingSchedules(updated);
  };

  const updateSchedule = (index: number, field: keyof DoctorSchedule, value: any) => {
    const updated = [...editingSchedules];
    updated[index] = { ...updated[index], [field]: value };
    setEditingSchedules(updated);
  };

  const saveSchedules = async () => {
    try {
      setSaving(true);
      await schedulesApi.createWeeklySchedule(doctorId, { schedules: editingSchedules });
      onScheduleChange?.();
      alert('Horarios guardados exitosamente');
    } catch (error) {
      console.error('Error saving schedules:', error);
      alert('Error al guardar los horarios');
    } finally {
      setSaving(false);
    }
  };

  const getSchedulesForDay = (dayOfWeek: number) => {
    return editingSchedules
      .map((schedule, index) => ({ ...schedule, originalIndex: index }))
      .filter(schedule => schedule.day_of_week === dayOfWeek);
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
          <Clock className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Horario Semanal</h3>
        </div>
        <button
          onClick={saveSchedules}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {DAYS_OF_WEEK.map(day => {
          const daySchedules = getSchedulesForDay(day.value);

          return (
            <div key={day.value} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">{day.label}</h4>
                <button
                  onClick={() => addScheduleForDay(day.value)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              </div>

              {daySchedules.length === 0 ? (
                <p className="text-gray-500 text-sm">Sin horarios definidos</p>
              ) : (
                <div className="space-y-2">
                  {daySchedules.map((schedule, localIndex) => (
                    <div key={localIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <input
                        type="time"
                        value={schedule.start_time}
                        onChange={(e) => updateSchedule(schedule.originalIndex!, 'start_time', e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="time"
                        value={schedule.end_time}
                        onChange={(e) => updateSchedule(schedule.originalIndex!, 'end_time', e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      />
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={schedule.is_active}
                          onChange={(e) => updateSchedule(schedule.originalIndex!, 'is_active', e.target.checked)}
                          className="rounded"
                        />
                        Activo
                      </label>
                      <button
                        onClick={() => removeSchedule(schedule.originalIndex!)}
                        className="text-red-600 hover:text-red-700 ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyScheduleGrid;