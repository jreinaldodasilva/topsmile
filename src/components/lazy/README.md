# Lazy Loaded Components

Centralized exports for heavy components that should be lazy loaded.

## Usage

```tsx
import { LazyWrapper } from '../common';
import { DentalChartView } from '../lazy';

<LazyWrapper>
    <DentalChartView />
</LazyWrapper>;
```

## Components

- **DentalChartView**: Interactive dental chart (heavy SVG rendering)
- **ChartHistory**: Chart version history with diff viewer
- **ChartExport**: PDF export functionality
- **PaymentRetryModal**: Payment processing UI
- **CreateContactModal**: Contact creation form
- **ViewContactModal**: Contact details viewer
- **ColorCodedCalendar**: Enhanced calendar with color coding
- **WaitlistPanel**: Waitlist management interface
- **RecurringAppointmentDialog**: Recurring appointment setup

## Benefits

1. **Reduced initial bundle**: Heavy components loaded on demand
2. **Better performance**: Faster initial page load
3. **Automatic code splitting**: Webpack creates separate chunks
4. **Centralized management**: Single source for lazy components
