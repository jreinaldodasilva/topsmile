// src/components/lazy/index.ts
import { lazy } from 'react';

// Heavy components - lazy loaded
export const DentalChartView = lazy(() => import('../Clinical/DentalChart/DentalChartView'));
export const ChartHistory = lazy(() => import('../Clinical/DentalChart/ChartHistory'));
export const ChartExport = lazy(() => import('../Clinical/DentalChart/ChartExport'));
export const PaymentRetryModal = lazy(() => import('../Payment/PaymentRetryModal'));
export const CreateContactModal = lazy(() => import('../Admin/Contacts/CreateContactModal'));
export const ViewContactModal = lazy(() => import('../Admin/Contacts/ViewContactModal'));
export const ColorCodedCalendar = lazy(() => import('../Calendar/Enhanced/ColorCodedCalendar'));
export const WaitlistPanel = lazy(() => import('../Calendar/Enhanced/WaitlistPanel'));
export const RecurringAppointmentDialog = lazy(() => import('../Calendar/Enhanced/RecurringAppointmentDialog'));
