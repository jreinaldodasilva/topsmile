// src/components/lazy/index.ts
import { lazy } from 'react';

// Heavy components - lazy loaded
export const DentalChartView = lazy(() => import('../Clinical/DentalChart/DentalChartView').then(m => ({ default: m.DentalChartView || m.default })));
export const ChartHistory = lazy(() => import('../Clinical/DentalChart/ChartHistory').then(m => ({ default: m.ChartHistory || m.default })));
export const ChartExport = lazy(() => import('../Clinical/DentalChart/ChartExport').then(m => ({ default: m.ChartExport || m.default })));
export const PaymentRetryModal = lazy(() => import('../Payment/PaymentRetryModal'));
export const CreateContactModal = lazy(() => import('../Admin/Contacts/CreateContactModal'));
export const ViewContactModal = lazy(() => import('../Admin/Contacts/ViewContactModal'));
export const ColorCodedCalendar = lazy(() => import('../Calendar/Enhanced/ColorCodedCalendar').then(m => ({ default: m.ColorCodedCalendar || m.default })));
export const WaitlistPanel = lazy(() => import('../Calendar/Enhanced/WaitlistPanel').then(m => ({ default: m.WaitlistPanel || m.default })));
export const RecurringAppointmentDialog = lazy(() => import('../Calendar/Enhanced/RecurringAppointmentDialog').then(m => ({ default: m.RecurringAppointmentDialog || m.default })));
