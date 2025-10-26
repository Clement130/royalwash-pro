// DateTimePicker component for booking flow
// This allows users to select a date and available time slot

'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DateTimePickerProps {
  selectedDate: string | null;
  selectedTime: string | null;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export function DateTimePicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  onNext,
  onBack,
}: DateTimePickerProps) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/availability?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableSlots(data.slots || []);
      } else {
        console.error('Failed to fetch slots');
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (value: Date | Date[]) => {
    const date = Array.isArray(value) ? value[0] : value;
    const formattedDate = format(date, 'yyyy-MM-dd');
    setCalendarDate(date);
    onDateChange(formattedDate);
    onTimeChange(''); // Reset time selection when date changes
  };

  const handleTimeSelect = (time: string) => {
    onTimeChange(time);
  };

  // Disable past dates and Sundays
  const tileDisabled = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0; // 0 = Sunday
  };

  const canProceed = selectedDate && selectedTime;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choisissez votre créneau
        </h2>
        <p className="text-gray-600">
          Sélectionnez une date puis une heure disponible
        </p>
      </div>

      {/* Calendar */}
      <div className="flex justify-center">
        <Calendar
          onChange={handleDateSelect}
          value={calendarDate}
          minDate={new Date()}
          tileDisabled={tileDisabled}
          locale="fr-FR"
          className="border rounded-lg shadow-sm"
        />
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="text-center">
          <p className="text-sm text-gray-600">Date sélectionnée</p>
          <p className="text-lg font-semibold text-blue-600">
            {format(new Date(selectedDate), 'EEEE d MMMM yyyy', { locale: fr })}
          </p>
        </div>
      )}

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Créneaux disponibles
          </h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des créneaux...</p>
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={`
                    px-4 py-3 rounded-lg font-medium transition-all
                    ${selectedTime === slot.time
                      ? 'bg-blue-600 text-white shadow-md'
                      : slot.available
                      ? 'bg-white border-2 border-gray-300 text-gray-900 hover:border-blue-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {slot.time}
                  {!slot.available && slot.reason && (
                    <span className="block text-xs mt-1">{slot.reason}</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">
              Aucun créneau disponible pour cette date
            </p>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Retour
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`
            px-8 py-3 rounded-lg font-medium transition-all
            ${canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
