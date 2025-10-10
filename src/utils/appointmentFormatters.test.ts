import { formatDateTime, formatTime, getStatusLabel, getStatusColor, getPriorityLabel } from './appointmentFormatters';

describe('appointmentFormatters', () => {
    describe('formatDateTime', () => {
        it('should format date and time to pt-BR locale', () => {
            const result = formatDateTime('2024-01-15T14:30:00');
            expect(result).toMatch(/15\/01\/2024.*14:30/);
        });

        it('should return empty string for undefined', () => {
            expect(formatDateTime(undefined)).toBe('');
        });
    });

    describe('formatTime', () => {
        it('should format time to pt-BR locale', () => {
            const result = formatTime('2024-01-15T14:30:00');
            expect(result).toBe('14:30');
        });

        it('should return empty string for undefined', () => {
            expect(formatTime(undefined)).toBe('');
        });
    });

    describe('getStatusLabel', () => {
        it('should return correct labels for all statuses', () => {
            expect(getStatusLabel('scheduled')).toBe('Agendado');
            expect(getStatusLabel('confirmed')).toBe('Confirmado');
            expect(getStatusLabel('checked_in')).toBe('Check-in');
            expect(getStatusLabel('in_progress')).toBe('Em andamento');
            expect(getStatusLabel('completed')).toBe('Concluído');
            expect(getStatusLabel('cancelled')).toBe('Cancelado');
            expect(getStatusLabel('no_show')).toBe('Faltou');
        });

        it('should return empty string for undefined', () => {
            expect(getStatusLabel(undefined)).toBe('');
        });

        it('should return original value for unknown status', () => {
            expect(getStatusLabel('unknown')).toBe('unknown');
        });
    });

    describe('getStatusColor', () => {
        it('should return correct colors for all statuses', () => {
            expect(getStatusColor('scheduled')).toBe('#6b7280');
            expect(getStatusColor('confirmed')).toBe('#3b82f6');
            expect(getStatusColor('checked_in')).toBe('#f59e0b');
            expect(getStatusColor('in_progress')).toBe('#10b981');
            expect(getStatusColor('completed')).toBe('#059669');
            expect(getStatusColor('cancelled')).toBe('#dc2626');
            expect(getStatusColor('no_show')).toBe('#991b1b');
        });

        it('should return default color for undefined', () => {
            expect(getStatusColor(undefined)).toBe('#6b7280');
        });

        it('should return default color for unknown status', () => {
            expect(getStatusColor('unknown')).toBe('#6b7280');
        });
    });

    describe('getPriorityLabel', () => {
        it('should return correct labels for all priorities', () => {
            expect(getPriorityLabel('routine')).toBe('Rotina');
            expect(getPriorityLabel('urgent')).toBe('Urgente');
            expect(getPriorityLabel('emergency')).toBe('Emergência');
        });

        it('should return empty string for undefined', () => {
            expect(getPriorityLabel(undefined)).toBe('');
        });

        it('should return original value for unknown priority', () => {
            expect(getPriorityLabel('unknown')).toBe('unknown');
        });
    });
});
