// frontend/src/pages/Calendar.tsx
import React, { useEffect, useState } from 'react';
import api from '../../types/api';
import DayPicker from 'react-calendar'; // or any calendar

interface Appointment {
  _id: string;
  scheduledAt: string;
  patientId: string;
}

const CalendarPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  useEffect(() => {
    api.get('/appointments').then(res => setAppointments(res.data));
  }, []);
  return <DayPicker tileContent={({ date }) => {
    return appointments.some(a => new Date(a.scheduledAt).toDateString() === date.toDateString())
      ? <span>•</span> : null;
  }} />;
};

export default CalendarPage;
