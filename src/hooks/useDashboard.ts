import { useDashboardStats } from './queries/useStats';
import { useAppointments } from './queries/useAppointments';
import { usePatients } from './queries/usePatients';
import { useAuth } from '../contexts/AuthContext';
import type { Appointment, Patient } from '@topsmile/types';

interface DashboardAppointment {
    id: string;
    patientName: string;
    time: string;
    type: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface RecentPatient {
    id: string;
    name: string;
    lastVisit: Date;
    nextAppointment?: Date;
    status: 'active' | 'inactive';
    avatar?: string;
}

export const useDashboard = () => {
    const { user } = useAuth();
    const clinicId = user?.clinicId || '';

    const { data: stats, isLoading: statsLoading } = useDashboardStats(clinicId);
    const { data: appointments, isLoading: appointmentsLoading } = useAppointments(clinicId, { limit: 5 });
    const { data: patients, isLoading: patientsLoading } = usePatients(clinicId, { limit: 5 });

    const upcomingAppointments: DashboardAppointment[] = (appointments || []).map((apt: Appointment) => ({
        id: apt._id || '',
        patientName: typeof apt.patient === 'string' ? apt.patient : apt.patient?.fullName || 'Unknown',
        time: apt.scheduledStart ? new Date(apt.scheduledStart).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        type: typeof apt.appointmentType === 'string' ? apt.appointmentType : apt.appointmentType?.name || 'Consulta',
        status: apt.status === 'in_progress' ? 'in-progress' : (apt.status as any)
    }));

    const recentPatients: RecentPatient[] = (patients || []).map((p: Patient) => ({
        id: p._id || '',
        name: p.fullName || `${p.firstName} ${p.lastName || ''}`.trim(),
        lastVisit: new Date(p.createdAt || Date.now()),
        status: p.isActive ? 'active' : 'inactive'
    }));

    return {
        stats,
        upcomingAppointments,
        recentPatients,
        isLoading: statsLoading || appointmentsLoading || patientsLoading
    };
};
