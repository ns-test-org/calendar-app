'use client';

import { useState } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Handle date click
  const handleDateClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setShowEventForm(true);
  };

  // Add event
  const addEvent = () => {
    if (eventTitle && selectedDate) {
      const newEvent: Event = {
        id: Date.now().toString(),
        title: eventTitle,
        date: selectedDate,
        time: eventTime || '12:00'
      };
      setEvents([...events, newEvent]);
      setEventTitle('');
      setEventTime('');
      setShowEventForm(false);
      setSelectedDate(null);
    }
  };

  // Delete event
  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  // Get events for a specific date
  const getEventsForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before month starts
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDate(day);
    const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    
    calendarDays.push(
      <div
        key={day}
        className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-blue-50 ${
          isToday ? 'bg-blue-100' : ''
        }`}
        onClick={() => handleDateClick(day)}
      >
        <div className={`font-semibold ${isToday ? 'text-blue-600' : ''}`}>
          {day}
        </div>
        <div className="text-xs space-y-1 mt-1">
          {dayEvents.slice(0, 2).map(event => (
            <div
              key={event.id}
              className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs truncate"
              onClick={(e) => {
                e.stopPropagation();
                deleteEvent(event.id);
              }}
              title={`${event.title} at ${event.time} - Click to delete`}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className="text-gray-500 text-xs">+{dayEvents.length - 2} more</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">My Calendar</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousMonth}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              ←
            </button>
            <h2 className="text-xl font-semibold min-w-48 text-center">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={goToNextMonth}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              →
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center font-semibold text-gray-600 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {calendarDays}
        </div>
      </div>

      {/* Event form modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Add Event for {selectedDate}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time (optional)
                </label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={addEvent}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Event
                </button>
                <button
                  onClick={() => {
                    setShowEventForm(false);
                    setSelectedDate(null);
                    setEventTitle('');
                    setEventTime('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

