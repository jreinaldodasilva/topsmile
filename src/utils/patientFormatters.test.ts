import { formatDate, calculateAge, getGenderLabel } from './patientFormatters';

describe('patientFormatters', () => {
    describe('formatDate', () => {
        it('should format date string to pt-BR locale', () => {
            const result = formatDate('2024-01-15T12:00:00');
            expect(result).toMatch(/\d{2}\/\d{2}\/2024/);
        });

        it('should format Date object to pt-BR locale', () => {
            const date = new Date(2024, 0, 15);
            const result = formatDate(date);
            expect(result).toBe('15/01/2024');
        });

        it('should return "-" for undefined', () => {
            expect(formatDate(undefined)).toBe('-');
        });

        it('should return "-" for empty string', () => {
            expect(formatDate('')).toBe('-');
        });
    });

    describe('calculateAge', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date('2024-01-15'));
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should calculate age correctly', () => {
            const result = calculateAge('2000-01-15');
            expect(result).toBe('24 anos');
        });

        it('should handle birthday not yet occurred this year', () => {
            const result = calculateAge('2000-02-15');
            expect(result).toBe('23 anos');
        });

        it('should return "-" for undefined', () => {
            expect(calculateAge(undefined)).toBe('-');
        });
    });

    describe('getGenderLabel', () => {
        it('should return "Masculino" for male', () => {
            expect(getGenderLabel('male')).toBe('Masculino');
        });

        it('should return "Feminino" for female', () => {
            expect(getGenderLabel('female')).toBe('Feminino');
        });

        it('should return "Outro" for other', () => {
            expect(getGenderLabel('other')).toBe('Outro');
        });

        it('should return "Prefere não dizer" for prefer_not_to_say', () => {
            expect(getGenderLabel('prefer_not_to_say')).toBe('Prefere não dizer');
        });

        it('should return "-" for undefined', () => {
            expect(getGenderLabel(undefined)).toBe('-');
        });

        it('should return "-" for unknown value', () => {
            expect(getGenderLabel('unknown')).toBe('-');
        });
    });
});
