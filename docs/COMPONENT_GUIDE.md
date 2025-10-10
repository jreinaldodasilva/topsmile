# Component Guide

## Overview

This guide documents the key components in TopSmile, their usage, props, and examples.

## Custom Hooks

### usePatientManagement

Manages patient list state, filtering, pagination, and CRUD operations.

**Usage:**
```typescript
import { usePatientManagement } from '../hooks/usePatientManagement';

const MyComponent = () => {
    const {
        patients,
        loading,
        error,
        filters,
        handleSearchChange,
        handleFilterChange,
        handlePageChange,
        handleSort,
        handleDeletePatient,
        addPatient,
        updatePatient
    } = usePatientManagement();

    return (
        <div>
            <input onChange={handleSearchChange} />
            {patients.map(patient => <div key={patient._id}>{patient.fullName}</div>)}
        </div>
    );
};
```

**Returns:**
- `patients`: Patient[] - Current page of patients
- `loading`: boolean - Loading state
- `error`: string | null - Error message
- `filters`: PatientFilters - Current filters
- `total`: number - Total patient count
- `handleSearchChange`: (e) => void - Search handler
- `handleFilterChange`: (key, value) => void - Filter handler
- `handlePageChange`: (page) => void - Pagination handler
- `handleSort`: (field) => void - Sort handler
- `handleDeletePatient`: (id) => Promise<void> - Delete handler
- `addPatient`: (patient) => void - Add to list
- `updatePatient`: (patient) => void - Update in list

### usePatientForm

Manages patient form state, validation, and submission.

**Usage:**
```typescript
import { usePatientForm } from '../hooks/usePatientForm';

const MyForm = ({ patient, onSave }) => {
    const {
        formData,
        errors,
        submitting,
        handleInputChange,
        handleArrayInputChange,
        handleSubmit
    } = usePatientForm(patient, onSave);

    return (
        <form onSubmit={handleSubmit}>
            <input name="firstName" value={formData.firstName} onChange={handleInputChange} />
            {errors.firstName && <span>{errors.firstName}</span>}
            <button type="submit" disabled={submitting}>Save</button>
        </form>
    );
};
```

**Parameters:**
- `patient`: Patient | null - Existing patient to edit
- `onSave`: (patient) => void - Callback on successful save

**Returns:**
- `formData`: PatientFormData - Current form state
- `errors`: Record<string, string> - Validation errors
- `submitting`: boolean - Submission state
- `handleInputChange`: (e) => void - Input change handler
- `handleArrayInputChange`: (section, value) => void - Array input handler
- `handleSubmit`: (e) => Promise<void> - Form submission handler

### useAppointmentCalendar

Manages appointment calendar state, filters, and navigation.

**Usage:**
```typescript
import { useAppointmentCalendar } from '../hooks/useAppointmentCalendar';

const Calendar = () => {
    const {
        appointments,
        providers,
        loading,
        filters,
        currentDate,
        handleFilterChange,
        navigateDate,
        goToToday,
        getDateRangeLabel
    } = useAppointmentCalendar();

    return (
        <div>
            <h2>{getDateRangeLabel()}</h2>
            <button onClick={() => navigateDate('prev')}>Previous</button>
            <button onClick={goToToday}>Today</button>
            <button onClick={() => navigateDate('next')}>Next</button>
        </div>
    );
};
```

**Returns:**
- `appointments`: Appointment[] - Filtered appointments
- `providers`: Provider[] - Active providers
- `loading`: boolean - Loading state
- `filters`: CalendarFilters - Current filters
- `currentDate`: Date - Current calendar date
- `handleFilterChange`: (key, value) => void - Filter handler
- `navigateDate`: (direction) => void - Navigate prev/next
- `goToToday`: () => void - Jump to today
- `getDateRangeLabel`: () => string - Formatted date range

## UI Components

### LazyImage

Lazy-loaded image component with Intersection Observer.

**Usage:**
```typescript
import { LazyImage } from '../components/LazyImage';

<LazyImage
    src="/images/photo.jpg"
    alt="Description"
    className="my-image"
    placeholder="/images/placeholder.jpg"
/>
```

**Props:**
- `src`: string (required) - Image source URL
- `alt`: string (required) - Alternative text
- `placeholder`: string (optional) - Placeholder image URL
- `className`: string (optional) - CSS class
- All standard img attributes supported

**Features:**
- Loads only when visible (Intersection Observer)
- Smooth fade-in transition
- 50px preload margin
- Placeholder support

### PatientRow

Memoized patient list row component.

**Usage:**
```typescript
import PatientRow from '../components/Admin/PatientRow';

<table>
    <tbody>
        {patients.map(patient => (
            <PatientRow
                key={patient._id}
                patient={patient}
                onView={handleView}
                onEdit={handleEdit}
                onSchedule={handleSchedule}
                onDelete={handleDelete}
            />
        ))}
    </tbody>
</table>
```

**Props:**
- `patient`: Patient (required) - Patient data
- `onView`: (patient) => void (required) - View handler
- `onEdit`: (patient) => void (required) - Edit handler
- `onSchedule`: (patient) => void (required) - Schedule handler
- `onDelete`: (id) => void (required) - Delete handler

**Features:**
- Memoized with React.memo
- Only re-renders when patient data changes
- Optimized for large lists

## Utility Functions

### Patient Formatters

**Location:** `src/utils/patientFormatters.ts`

```typescript
import { formatDate, calculateAge, getGenderLabel } from '../utils/patientFormatters';

// Format date to pt-BR locale
const formatted = formatDate('2024-01-15'); // "15/01/2024"

// Calculate age from birth date
const age = calculateAge('2000-01-15'); // "24 anos"

// Get gender label in Portuguese
const gender = getGenderLabel('male'); // "Masculino"
```

### Appointment Formatters

**Location:** `src/utils/appointmentFormatters.ts`

```typescript
import {
    formatDateTime,
    formatTime,
    getStatusLabel,
    getStatusColor,
    getPriorityLabel
} from '../utils/appointmentFormatters';

// Format date and time
const dateTime = formatDateTime('2024-01-15T14:30:00'); // "15/01/2024, 14:30"

// Format time only
const time = formatTime('2024-01-15T14:30:00'); // "14:30"

// Get status label
const status = getStatusLabel('scheduled'); // "Agendado"

// Get status color
const color = getStatusColor('confirmed'); // "#3b82f6"

// Get priority label
const priority = getPriorityLabel('urgent'); // "Urgente"
```

## Best Practices

### Using Custom Hooks

✅ **Do:**
- Use hooks at component top level
- Destructure only needed values
- Handle loading and error states
- Use memoized callbacks

❌ **Don't:**
- Call hooks conditionally
- Call hooks in loops
- Ignore error states
- Recreate callbacks unnecessarily

### Component Optimization

✅ **Do:**
- Use React.memo for list items
- Use useCallback for event handlers
- Use useMemo for expensive computations
- Keep components focused

❌ **Don't:**
- Optimize prematurely
- Memo everything
- Create deep component trees
- Mix concerns

### State Management

✅ **Do:**
- Use custom hooks for complex state
- Keep state close to usage
- Use state updater functions
- Handle edge cases

❌ **Don't:**
- Lift state unnecessarily
- Create global state for local data
- Mutate state directly
- Ignore race conditions

## Examples

### Patient List with Filtering

```typescript
import { usePatientManagement } from '../hooks/usePatientManagement';
import PatientRow from '../components/Admin/PatientRow';

const PatientList = () => {
    const {
        patients,
        loading,
        error,
        handleSearchChange,
        handleFilterChange,
        handleDeletePatient
    } = usePatientManagement();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                onChange={handleSearchChange}
            />
            <select onChange={e => handleFilterChange('isActive', e.target.value === 'true')}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
            </select>
            <table>
                <tbody>
                    {patients.map(patient => (
                        <PatientRow
                            key={patient._id}
                            patient={patient}
                            onView={console.log}
                            onEdit={console.log}
                            onSchedule={console.log}
                            onDelete={handleDeletePatient}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
```

### Patient Form

```typescript
import { usePatientForm } from '../hooks/usePatientForm';

const PatientForm = ({ patient, onSave, onCancel }) => {
    const {
        formData,
        errors,
        submitting,
        handleInputChange,
        handleSubmit
    } = usePatientForm(patient, onSave);

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name *</label>
                <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                />
                {errors.firstName && <span>{errors.firstName}</span>}
            </div>
            <div>
                <label>Phone *</label>
                <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                />
                {errors.phone && <span>{errors.phone}</span>}
            </div>
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
            </button>
        </form>
    );
};
```

### Appointment Calendar

```typescript
import { useAppointmentCalendar } from '../hooks/useAppointmentCalendar';

const AppointmentCalendar = () => {
    const {
        appointments,
        loading,
        filters,
        handleFilterChange,
        navigateDate,
        goToToday,
        getDateRangeLabel
    } = useAppointmentCalendar();

    return (
        <div>
            <div>
                <button onClick={() => navigateDate('prev')}>←</button>
                <h2>{getDateRangeLabel()}</h2>
                <button onClick={() => navigateDate('next')}>→</button>
                <button onClick={goToToday}>Today</button>
            </div>
            <div>
                <button onClick={() => handleFilterChange('view', 'day')}>Day</button>
                <button onClick={() => handleFilterChange('view', 'week')}>Week</button>
                <button onClick={() => handleFilterChange('view', 'month')}>Month</button>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {appointments.map(apt => (
                        <div key={apt._id}>{apt.patient.fullName}</div>
                    ))}
                </div>
            )}
        </div>
    );
};
```

## Testing

### Testing Custom Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { usePatientManagement } from './usePatientManagement';

test('fetches patients on mount', async () => {
    const { result } = renderHook(() => usePatientManagement());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });

    expect(result.current.patients).toHaveLength(2);
});
```

### Testing Components

```typescript
import { render, screen } from '@testing-library/react';
import PatientRow from './PatientRow';

test('renders patient information', () => {
    const patient = {
        _id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890'
    };

    render(
        <table>
            <tbody>
                <PatientRow
                    patient={patient}
                    onView={jest.fn()}
                    onEdit={jest.fn()}
                    onSchedule={jest.fn()}
                    onDelete={jest.fn()}
                />
            </tbody>
        </table>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```
