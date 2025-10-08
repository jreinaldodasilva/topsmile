# Frontend-Backend Integration Quick Start

## For Developers: How to Add Missing Features

### Step 1: Check if API Method Exists

All API methods are in `src/services/apiService.ts`. Example:

```typescript
// Check if method exists
apiService.prescriptions.getAll(patientId)
apiService.prescriptions.create(data)
apiService.prescriptions.update(id, data)
```

**Result**: ✅ All backend endpoints have API methods - no API work needed!

### Step 2: Create UI Component

Use existing UI components from `src/components/UI/`:

```typescript
import { Button, Input, Modal, Select } from '../../components/UI';
import type { Prescription } from '@topsmile/types';

export const PrescriptionForm: React.FC<Props> = ({ onSave }) => {
  const [formData, setFormData] = useState<Partial<Prescription>>({});
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Medicamento"
        value={formData.medications?.[0]?.name || ''}
        onChange={(e) => /* update state */}
      />
      <Button type="submit">Salvar</Button>
    </form>
  );
};
```

### Step 3: Integrate with Page

Add to existing page or create new one:

```typescript
import { PrescriptionForm } from '../../components/Clinical/Prescriptions';

const PatientDetail = () => {
  const handleSavePrescription = async (data: any) => {
    const result = await apiService.prescriptions.create(data);
    if (result.success) {
      // Success handling
    }
  };

  return (
    <div>
      <PrescriptionForm onSave={handleSavePrescription} />
    </div>
  );
};
```

### Step 4: Use Shared Types

Always import types from `@topsmile/types`:

```typescript
import type {
  Patient,
  Appointment,
  Prescription,
  TreatmentPlan,
  ClinicalNote,
  DentalChart
} from '@topsmile/types';
```

## Common Patterns

### Pattern 1: List with CRUD

```typescript
const [items, setItems] = useState<Item[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchItems = async () => {
    setLoading(true);
    const result = await apiService.items.getAll();
    if (result.success) setItems(result.data || []);
    setLoading(false);
  };
  fetchItems();
}, []);

const handleCreate = async (data: Item) => {
  const result = await apiService.items.create(data);
  if (result.success) {
    setItems([...items, result.data!]);
  }
};

const handleUpdate = async (id: string, data: Partial<Item>) => {
  const result = await apiService.items.update(id, data);
  if (result.success) {
    setItems(items.map(item => item.id === id ? result.data! : item));
  }
};

const handleDelete = async (id: string) => {
  const result = await apiService.items.delete(id);
  if (result.success) {
    setItems(items.filter(item => item.id !== id));
  }
};
```

### Pattern 2: Form with Validation

```typescript
const [formData, setFormData] = useState<FormData>({});
const [errors, setErrors] = useState<Record<string, string>>({});

const validate = (): boolean => {
  const newErrors: Record<string, string> = {};
  if (!formData.required) newErrors.required = 'Campo obrigatório';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;
  
  const result = await apiService.items.create(formData);
  if (result.success) {
    onSuccess();
  } else {
    setErrors({ general: result.message || 'Erro ao salvar' });
  }
};
```

### Pattern 3: Modal Form

```typescript
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <Button onClick={() => setIsOpen(true)}>Novo Item</Button>
    
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Criar Item"
    >
      <ItemForm
        onSave={async (data) => {
          await handleCreate(data);
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
      />
    </Modal>
  </>
);
```

## Quick Reference: Missing Features

### High Priority (Do First)

1. **Recurring Appointments**
   - Component: ✅ `RecurringAppointmentForm` created
   - Integration: ❌ Add to `ScheduleAppointmentModal`
   - API: ✅ Ready

2. **Operatory Selection**
   - Component: ❌ Create `OperatorySelector`
   - Integration: ❌ Add to appointment form
   - API: ✅ `apiService.operatories.*`

3. **Billing Status**
   - Component: ❌ Add select to appointment form
   - Integration: ❌ Update appointment model
   - API: ✅ Field exists in backend

4. **Insurance Management**
   - Component: ❌ Enhance `InsuranceForm`
   - Integration: ❌ Add to patient detail
   - API: ✅ `apiService.insurance.*`

### Medium Priority

5. **Prescription Management**
   - Component: ❌ Create `PrescriptionForm` + `PrescriptionList`
   - Integration: ❌ Add tab to patient detail
   - API: ✅ `apiService.prescriptions.*`

6. **Waitlist Management**
   - Component: ❌ Create `WaitlistForm` + `WaitlistList`
   - Integration: ❌ Create new page
   - API: ✅ `apiService.waitlist.*`

7. **Provider Working Hours**
   - Component: ❌ Create `ProviderScheduleForm`
   - Integration: ❌ Add to provider detail
   - API: ✅ Field exists in backend

### Low Priority

8. **Consent Forms**
   - Component: ❌ Create `ConsentFormSigning`
   - Integration: ❌ Add to patient portal
   - API: ✅ Field exists in backend

9. **Patient Photo**
   - Component: ❌ Create `PhotoUpload`
   - Integration: ❌ Add to patient form
   - API: ✅ Field exists in backend

10. **Family Members**
    - Component: ❌ Create `FamilyMemberLink`
    - Integration: ❌ Add to patient detail
    - API: ✅ Field exists in backend

## File Structure

```
src/
├── components/
│   ├── UI/                    # Base components (Button, Input, Modal)
│   ├── Admin/
│   │   └── Forms/            # ✅ EnhancedPatientForm, RecurringAppointmentForm
│   ├── Clinical/
│   │   ├── DentalChart/      # ✅ Exists
│   │   ├── TreatmentPlan/    # ✅ Exists (view only)
│   │   ├── ClinicalNotes/    # ✅ Exists (view only)
│   │   ├── MedicalHistory/   # ✅ Exists
│   │   ├── Prescriptions/    # ❌ Need to create
│   │   └── Insurance/        # ❌ Need to enhance
│   └── PatientPortal/
│       ├── ConsentFormViewer.tsx  # ✅ Exists
│       └── InsuranceForm.tsx      # ✅ Exists (basic)
├── pages/
│   └── Admin/
│       ├── PatientDetail.tsx      # ✅ Updated
│       ├── AppointmentCalendar.tsx # ❌ Needs enhancement
│       ├── OperatoryManagement.tsx # ❌ Need to create
│       └── WaitlistManagement.tsx  # ❌ Need to create
├── services/
│   └── apiService.ts         # ✅ All methods exist
└── packages/types/src/
    └── index.ts              # ✅ All types defined
```

## Testing Your Changes

### 1. Unit Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

test('renders and submits form', async () => {
  const onSave = jest.fn();
  render(<MyComponent onSave={onSave} />);
  
  fireEvent.change(screen.getByLabelText('Nome'), {
    target: { value: 'Test' }
  });
  
  fireEvent.click(screen.getByText('Salvar'));
  
  expect(onSave).toHaveBeenCalled();
});
```

### 2. Integration Test

```typescript
import { apiService } from '../../services/apiService';

test('creates item via API', async () => {
  const data = { name: 'Test' };
  const result = await apiService.items.create(data);
  
  expect(result.success).toBe(true);
  expect(result.data).toHaveProperty('id');
});
```

### 3. Manual Test

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm start`
3. Navigate to feature
4. Test CRUD operations
5. Check browser console for errors
6. Check network tab for API calls

## Common Issues

### Issue 1: Type Errors

```typescript
// ❌ Wrong
const patient: any = await apiService.patients.getOne(id);

// ✅ Correct
import type { Patient } from '@topsmile/types';
const result = await apiService.patients.getOne(id);
const patient: Patient | undefined = result.data;
```

### Issue 2: Missing Error Handling

```typescript
// ❌ Wrong
const result = await apiService.items.create(data);
setItems([...items, result.data]);

// ✅ Correct
const result = await apiService.items.create(data);
if (result.success && result.data) {
  setItems([...items, result.data]);
} else {
  setError(result.message || 'Erro ao criar');
}
```

### Issue 3: Not Using Shared Types

```typescript
// ❌ Wrong
interface MyPatient {
  name: string;
  email: string;
}

// ✅ Correct
import type { Patient } from '@topsmile/types';
// Use Patient type directly
```

## Getting Help

1. **Check existing code**: Look at similar features
2. **Check documentation**: See `docs/` folder
3. **Check types**: See `packages/types/src/index.ts`
4. **Check API**: See `src/services/apiService.ts`
5. **Ask team**: Slack/Teams channel

## Useful Commands

```bash
# Start development
npm run dev                    # Both frontend + backend
npm start                      # Frontend only
cd backend && npm run dev      # Backend only

# Testing
npm test                       # Run all tests
npm run test:frontend          # Frontend tests only
cd backend && npm test         # Backend tests only

# Type checking
npm run type-check             # Check TypeScript types

# Build
npm run build                  # Build frontend
cd backend && npm run build    # Build backend
```

## Next Steps

1. Pick a feature from the priority list
2. Check if API method exists (it does!)
3. Create UI component using existing patterns
4. Integrate with existing page
5. Test thoroughly
6. Submit PR

---

**Remember**: All API methods exist, all types are defined. You just need to create UI components and integrate them!
