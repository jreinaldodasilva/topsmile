// src/components/lazy/index.ts
import { lazy } from 'react';

// Heavy components - lazy loaded
export const DentalChartView = lazy(() => import('../Clinical/DentalChart/DentalChartView').then(m => ({ default: (m as any).DentalChartView || (m as any).default })));
export const ChartHistory = lazy(() => import('../Clinical/DentalChart/ChartHistory').then(m => ({ default: (m as any).ChartHistory || (m as any).default })));
export const ChartExport = lazy(() => import('../Clinical/DentalChart/ChartExport').then(m => ({ default: (m as any).ChartExport || (m as any).default })));
export const PaymentRetryModal = lazy(() => import('../Payment/PaymentRetryModal'));
export const CreateContactModal = lazy(() => import('../Admin/Contacts/CreateContactModal'));
export const ViewContactModal = lazy(() => import('../Admin/Contacts/ViewContactModal'));
export const ColorCodedCalendar = lazy(() => import('../Calendar/Enhanced/ColorCodedCalendar').then(m => ({ default: (m as any).ColorCodedCalendar || (m as any).default })));
export const WaitlistPanel = lazy(() => import('../Calendar/Enhanced/WaitlistPanel').then(m => ({ default: (m as any).WaitlistPanel || (m as any).default })));
export const RecurringAppointmentDialog = lazy(() => import('../Calendar/Enhanced/RecurringAppointmentDialog').then(m => ({ default: (m as any).RecurringAppointmentDialog || (m as any).default })));
