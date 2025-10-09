# Manual Testing - Appointment Management Tests

## Purpose

Verify appointment scheduling, booking, modification, cancellation, and calendar functionality for staff users.

## Prerequisites

- Logged in as staff user (admin, provider, or staff role)
- Test patients exist in database
- Test providers configured with availability

## Appointment Creation Tests

### TC-APPT-001: Create New Appointment - Happy Path

**Objective**: Verify staff can create appointment successfully

**Test Steps**:
1. Navigate to Agendamentos or click "Novo Agendamento"
2. Select patient from dropdown or search
3. Select provider (dentist)
4. Select appointment type (e.g., "Consulta")
5. Select date (future date)
6. Select available time slot
7. Add notes (optional): "Primeira consulta"
8. Click "Agendar" or "Salvar"
9. Observe confirmation

**Expected Results**:
- Form fields populate correctly
- Only available time slots shown
- Validation passes
- Success message: "Agendamento criado com sucesso"
- Redirect to appointments list or calendar
- New appointment visible in list
- Confirmation email sent (check logs)

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-001 | | | |

---

### TC-APPT-002: Create Appointment - Required Field Validation

**Objective**: Verify required fields are enforced

**Test Steps**:
1. Click "Novo Agendamento"
2. Leave patient field empty
3. Click "Agendar"
4. Observe validation error
5. Select patient
6. Leave provider empty
7. Click "Agendar"
8. Observe validation error

**Expected Validation Messages**:
- "Paciente é obrigatório"
- "Profissional é obrigatório"
- "Data é obrigatória"
- "Horário é obrigatório"
- "Tipo de agendamento é obrigatório"

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-002 | | | |

---

### TC-APPT-003: Create Appointment - Past Date Validation

**Objective**: Verify cannot schedule in the past

**Test Steps**:
1. Click "Novo Agendamento"
2. Fill required fields
3. Select yesterday's date
4. Attempt to save

**Expected Results**:
- Error message: "Não é possível agendar no passado"
- Or date picker disables past dates
- Appointment not created

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-003 | | | |

---

### TC-APPT-004: Create Appointment - Conflict Detection

**Objective**: Verify system detects scheduling conflicts

**Test Steps**:
1. Create appointment for Provider A at 10:00 AM
2. Attempt to create another appointment for same provider at 10:00 AM
3. Observe conflict warning

**Expected Results**:
- Warning message: "Profissional já possui agendamento neste horário"
- Time slot marked as unavailable
- Cannot double-book provider

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-004 | | | |

---

### TC-APPT-005: Create Appointment - Available Slots Display

**Objective**: Verify only available time slots shown

**Test Steps**:
1. Click "Novo Agendamento"
2. Select provider with existing appointments
3. Select date
4. Observe available time slots

**Expected Results**:
- Only available slots shown
- Booked slots disabled or hidden
- Slots respect provider working hours
- Slots match appointment type duration

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-005 | | | |

---

## Appointment Viewing Tests

### TC-APPT-101: View Appointments List

**Objective**: Verify appointments list displays correctly

**Test Steps**:
1. Navigate to Agendamentos page
2. Observe appointments list
3. Verify columns and data

**Expected Columns**:
- Data/Hora (Date/Time)
- Paciente (Patient)
- Profissional (Provider)
- Tipo (Type)
- Status
- Ações (Actions)

**Expected Results**:
- All appointments visible
- Data sorted by date (default)
- Status badges color-coded
- Action buttons available

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-101 | | | |

---

### TC-APPT-102: Filter Appointments by Date

**Objective**: Verify date filtering works

**Test Steps**:
1. Navigate to appointments list
2. Select date filter (e.g., "Hoje", "Esta Semana")
3. Observe filtered results
4. Select custom date range
5. Observe filtered results

**Expected Results**:
- Filter applies correctly
- Only appointments in range shown
- Count updates
- Clear filter option available

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-102 | | | |

---

### TC-APPT-103: Filter Appointments by Status

**Objective**: Verify status filtering works

**Test Steps**:
1. Navigate to appointments list
2. Select status filter dropdown
3. Select "Confirmado"
4. Observe filtered results
5. Select "Pendente"
6. Observe filtered results

**Expected Status Options**:
- Todos (All)
- Pendente (Pending)
- Confirmado (Confirmed)
- Em Atendimento (In Progress)
- Concluído (Completed)
- Cancelado (Cancelled)
- Falta (No Show)

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-103 | | | |

---

### TC-APPT-104: Search Appointments

**Objective**: Verify search functionality

**Test Steps**:
1. Navigate to appointments list
2. Enter patient name in search box
3. Observe filtered results
4. Clear search
5. Search by provider name
6. Observe results

**Expected Results**:
- Search filters list in real-time
- Matches patient name
- Matches provider name
- Case-insensitive search
- Clear search button available

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-104 | | | |

---

### TC-APPT-105: View Appointment Details

**Objective**: Verify appointment detail view

**Test Steps**:
1. Navigate to appointments list
2. Click on specific appointment
3. Observe detail view/modal

**Expected Details**:
- Patient name and photo
- Provider name
- Date and time
- Appointment type
- Duration
- Status
- Notes
- Created by/date
- Action buttons (Edit, Cancel, etc.)

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-105 | | | |

---

## Appointment Modification Tests

### TC-APPT-201: Edit Appointment - Change Time

**Objective**: Verify can reschedule appointment

**Test Steps**:
1. Navigate to appointment details
2. Click "Editar" button
3. Change time to different slot
4. Click "Salvar"
5. Observe confirmation

**Expected Results**:
- Edit form pre-populated with current data
- Can select new time slot
- Validation checks for conflicts
- Success message: "Agendamento atualizado com sucesso"
- Updated time reflected in list

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-201 | | | |

---

### TC-APPT-202: Edit Appointment - Change Provider

**Objective**: Verify can reassign to different provider

**Test Steps**:
1. Edit existing appointment
2. Change provider
3. Verify available slots update
4. Select new time if needed
5. Save changes

**Expected Results**:
- Provider dropdown shows all providers
- Available slots recalculate for new provider
- Appointment updated successfully
- Notification sent to new provider (if applicable)

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-202 | | | |

---

### TC-APPT-203: Update Appointment Status

**Objective**: Verify status can be updated

**Test Steps**:
1. View appointment details
2. Change status from "Pendente" to "Confirmado"
3. Save changes
4. Verify status badge updates

**Expected Status Transitions**:
- Pendente → Confirmado
- Confirmado → Em Atendimento
- Em Atendimento → Concluído
- Any → Cancelado

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-203 | | | |

---

### TC-APPT-204: Add Notes to Appointment

**Objective**: Verify can add/edit notes

**Test Steps**:
1. Edit appointment
2. Add notes: "Paciente solicitou horário específico"
3. Save changes
4. View appointment details
5. Verify notes displayed

**Expected Results**:
- Notes field accepts text
- Notes saved correctly
- Notes visible in detail view
- Notes editable

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-204 | | | |

---

## Appointment Cancellation Tests

### TC-APPT-301: Cancel Appointment

**Objective**: Verify appointment cancellation

**Test Steps**:
1. View appointment details
2. Click "Cancelar" button
3. Observe confirmation dialog
4. Enter cancellation reason (if required)
5. Confirm cancellation
6. Observe result

**Expected Results**:
- Confirmation dialog appears
- Warning message about cancellation
- Reason field (optional or required)
- Success message: "Agendamento cancelado"
- Status changes to "Cancelado"
- Cancellation email sent to patient

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-301 | | | |

---

### TC-APPT-302: Cancel Past Appointment

**Objective**: Verify cannot cancel completed appointments

**Test Steps**:
1. View completed appointment
2. Attempt to cancel
3. Observe behavior

**Expected Results**:
- Cancel button disabled or hidden
- Or warning: "Não é possível cancelar agendamento concluído"

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-302 | | | |

---

## Calendar View Tests

### TC-APPT-401: View Calendar

**Objective**: Verify calendar displays appointments

**Test Steps**:
1. Navigate to Calendário page
2. Observe calendar view
3. Verify appointments displayed

**Expected Results**:
- Calendar shows current month
- Appointments visible on dates
- Color-coded by status or type
- Click date to view appointments
- Navigation arrows work (prev/next month)

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-401 | | | |

---

### TC-APPT-402: Calendar - Day View

**Objective**: Verify day view shows schedule

**Test Steps**:
1. Navigate to calendar
2. Switch to day view
3. Select specific date
4. Observe appointments

**Expected Results**:
- Time slots displayed (e.g., 8:00 AM - 6:00 PM)
- Appointments in correct time slots
- Duration reflected visually
- Provider names shown
- Click appointment to view details

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-402 | | | |

---

### TC-APPT-403: Calendar - Week View

**Objective**: Verify week view displays correctly

**Test Steps**:
1. Switch to week view
2. Observe 7-day layout
3. Verify appointments across week

**Expected Results**:
- 7 columns (days of week)
- Current day highlighted
- Appointments in correct days/times
- Scroll to view all hours

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-403 | | | |

---

### TC-APPT-404: Calendar - Filter by Provider

**Objective**: Verify can filter calendar by provider

**Test Steps**:
1. View calendar
2. Select provider filter
3. Choose specific provider
4. Observe filtered view

**Expected Results**:
- Only selected provider's appointments shown
- Filter persists across view changes
- Clear filter option available

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-404 | | | |

---

### TC-APPT-405: Create Appointment from Calendar

**Objective**: Verify can create appointment by clicking calendar

**Test Steps**:
1. View calendar (day or week view)
2. Click empty time slot
3. Observe appointment creation form
4. Verify date/time pre-filled
5. Complete and save

**Expected Results**:
- Click opens appointment form
- Date and time pre-populated
- Can complete booking
- New appointment appears on calendar

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-405 | | | |

---

## Appointment Reminders Tests

### TC-APPT-501: Email Reminder Configuration

**Objective**: Verify email reminders can be configured

**Test Steps**:
1. Create appointment
2. Check reminder settings
3. Verify email reminder option
4. Set reminder time (e.g., 24 hours before)

**Expected Results**:
- Reminder checkbox available
- Time options available (24h, 48h, 1 week)
- Reminder scheduled
- Email sent at configured time (check logs)

**Note**: Full test requires waiting or checking scheduled jobs.

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-501 | | | |

---

### TC-APPT-502: SMS Reminder Configuration

**Objective**: Verify SMS reminders can be configured

**Test Steps**:
1. Create appointment
2. Enable SMS reminder
3. Verify patient phone number present
4. Set reminder time

**Expected Results**:
- SMS option available
- Requires patient phone number
- SMS scheduled
- SMS sent at configured time (check Twilio logs)

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-APPT-502 | | | |

---

## Test Summary

| Category | Total Tests | Passed | Failed | Blocked | Pass Rate |
|----------|-------------|--------|--------|---------|-----------|
| Creation | 5 | | | | |
| Viewing | 5 | | | | |
| Modification | 4 | | | | |
| Cancellation | 2 | | | | |
| Calendar | 5 | | | | |
| Reminders | 2 | | | | |
| **TOTAL** | **23** | | | | |

## Next Steps

After completing appointment tests:
1. ✅ Document all results
2. 🐛 Report any failures
3. 📋 Proceed to **Document 06 - Patient Management Tests**

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Test Coverage**: Appointment Scheduling & Management
