import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { schedulesApi, type TimeSlot } from '../../api/schedules';

interface AvailabilityCalendarProps {
  doctorId: number;
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  onSlotSelect?: (slot: TimeSlot) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  doctorId,
  selectedDate,
  onDateSelect,
  onSlotSelect
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentDate) {
      loadAvailableSlots(currentDate);
      onDateSelect?.(currentDate);
    }
  }, [currentDate, doctorId]);

  const loadAvailableSlots = async (date: string) => {
    try {
      setLoading(true);
      console.log(`🔍 FRONTEND: Loading slots for doctor ${doctorId} on ${date}`);

      const response = await schedulesApi.getAvailableSlots(doctorId, date);

      console.log(`📊 FRONTEND: Received ${response.available_slots.length} slots:`, response.available_slots);

      setAvailableSlots(response.available_slots);
    } catch (error) {
      console.error('❌ FRONTEND: Error loading available slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // HH:MM format
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(event.target.value);
  };

  const handleSlotClick = (slot: TimeSlot) => {
    console.log(`✅ FRONTEND: User selected slot:`, slot);
    onSlotSelect?.(slot);
  };

  const generateTimeRange = () => {
    const times = [];
    for (let hour = 7; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const isSlotAvailable = (time: string) => {
    return availableSlots.some(slot =>
      slot.start_time <= time && time < slot.end_time && slot.is_available
    );
  };

  const getSlotForTime = (time: string) => {
    return availableSlots.find(slot =>
      slot.start_time <= time && time < slot.end_time
    );
  };

  const timeRange = generateTimeRange();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Disponibilidad</h3>
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar fecha:
        </label>
        <input
          type="date"
          value={currentDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Available Slots */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">
          Horarios disponibles para {new Date(currentDate + 'T12:00:00').toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h4>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay horarios disponibles para esta fecha</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {availableSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleSlotClick(slot)}
                className="flex items-center justify-center px-3 py-2 text-sm border border-green-200 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
              >
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(slot.start_time)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Time Grid for Visual Reference */}
      <div className="mt-8">
        <h4 className="font-medium text-gray-900 mb-4">Vista general del día</h4>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1">
          {timeRange.map(time => {
            const available = isSlotAvailable(time);
            const slot = getSlotForTime(time);

            return (
              <div
                key={time}
                className={`
                  text-xs p-1 text-center rounded border
                  ${available
                    ? 'bg-green-100 border-green-200 text-green-800 cursor-pointer hover:bg-green-200'
                    : 'bg-gray-100 border-gray-200 text-gray-500'
                  }
                `}
                onClick={() => available && slot && handleSlotClick(slot)}
              >
                {formatTime(time)}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
            <span>No disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;