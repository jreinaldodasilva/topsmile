# Component Usage Guide - Patient Management

**Version:** 1.0  
**Date:** 2024  

## PatientDetail Component

### Overview
Complete patient management interface with 5 tabs for viewing and editing patient information, clinical data, and medical history.

### Location
`src/pages/Admin/PatientDetail.tsx`

### Route
`/admin/patients/:id`

### Usage
```typescript
import PatientDetail from './pages/Admin/PatientDetail';

// In router
<Route path="/admin/patients/:id" element={<PatientDetail />} />
```

### Features
- Patient information display and editing
- Dental chart visualization
- Treatment plan viewing
- Clinical notes timeline
- Medical history management

### Props
None (uses URL parameter for patient ID)

### Dependencies
- `apiService` - API communication
- `DentalChart` - Dental chart component
- `TreatmentPlanView` - Treatment plan display
- `NotesTimeline` - Clinical notes timeline
- `MedicalHistoryForm` - Medical history form

## DentalChart Component

### Overview
Interactive dental chart with tooth selection, condition marking, and history tracking.

### Location
`src/components/Clinical/DentalChart/index.tsx`

### Usage
```typescript
import { DentalChart } from '../../components/Clinical/DentalChart';

<DentalChart patientId={patientId} />
```

### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| patientId | string | Yes | Patient ID for loading chart data |

### Features
- FDI/Universal numbering systems
- Tooth selection and condition marking
- Chart history viewing
- Annotations and notes
- Export functionality

## TreatmentPlanView Component

### Overview
Displays treatment plan with phases, procedures, and cost breakdown.

### Location
`src/components/Clinical/TreatmentPlan/TreatmentPlanView.tsx`

### Usage
```typescript
import { TreatmentPlanView } from '../../components/Clinical/TreatmentPlan';

<TreatmentPlanView plan={plan} />
```

### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| plan | TreatmentPlan | Yes | Treatment plan object |
| onAccept | () => void | No | Callback for accepting plan |
| onUpdatePhase | (phase, status) => void | No | Callback for phase updates |
| isPatientView | boolean | No | Patient vs provider view |

### Features
- Phase-based treatment display
- Procedure list with CDT codes
- Cost breakdown
- Status badges
- Presentation mode
- Print functionality

## NotesTimeline Component

### Overview
Timeline view of clinical notes with type indicators and previews.

### Location
`src/components/Clinical/ClinicalNotes/NotesTimeline.tsx`

### Usage
```typescript
import { NotesTimeline } from '../../components/Clinical/ClinicalNotes';

<NotesTimeline 
  notes={notes} 
  onViewNote={(id) => navigate(`/notes/${id}`)} 
/>
```

### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| notes | Note[] | Yes | Array of clinical notes |
| onViewNote | (id: string) => void | Yes | Callback for viewing note details |

### Features
- Timeline visualization
- Note type badges (SOAP, Progress, etc.)
- Date formatting (pt-BR)
- Content preview (100 chars)
- Lock indicators
- Empty state handling

## MedicalHistoryForm Component

### Overview
Comprehensive medical history form with conditions, allergies, and medications.

### Location
`src/components/Clinical/MedicalHistory/MedicalHistoryForm.tsx`

### Usage
```typescript
import { MedicalHistoryForm } from '../../components/Clinical/MedicalHistory';

<MedicalHistoryForm
  patientId={patientId}
  onSave={handleSave}
  initialData={history}
/>
```

### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| patientId | string | Yes | Patient ID |
| onSave | (data) => void | Yes | Save callback |
| initialData | MedicalHistory | No | Existing history data |

### Features
- Chief complaint input
- Medical conditions checkboxes
- Dental history checkboxes
- Allergy manager
- Medication manager
- Social history (smoking, alcohol)

## Common Patterns

### Loading State
```typescript
{loading ? (
  <p>Carregando...</p>
) : (
  <Component data={data} />
)}
```

### Error State
```typescript
{error && (
  <div style={{ padding: '10px', background: '#fee' }}>
    <p style={{ color: 'red' }}>{error}</p>
    <button onClick={retry}>Tentar Novamente</button>
  </div>
)}
```

### Empty State
```typescript
{data.length === 0 ? (
  <p style={{ color: '#666' }}>Nenhum dado encontrado.</p>
) : (
  <List items={data} />
)}
```

### Edit Mode
```typescript
const [isEditing, setIsEditing] = useState(false);
const [editData, setEditData] = useState({});

{!isEditing ? (
  <DisplayView data={data} onEdit={() => setIsEditing(true)} />
) : (
  <EditForm 
    data={editData} 
    onChange={setEditData}
    onSave={handleSave}
    onCancel={() => setIsEditing(false)}
  />
)}
```

## Styling Guidelines

### Inline Styles (Current)
```typescript
<div style={{ 
  padding: '20px', 
  maxWidth: '1200px', 
  margin: '0 auto' 
}}>
```

### Error Styling
```typescript
style={{ 
  padding: '10px', 
  background: '#fee', 
  border: '1px solid #fcc', 
  borderRadius: '4px' 
}}
```

### Button Styling
```typescript
style={{ 
  padding: '8px 16px', 
  cursor: 'pointer',
  background: '#007bff',
  color: 'white',
  border: 'none'
}}
```

## State Management

### Local State
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### Lazy Loading
```typescript
useEffect(() => {
  if (activeTab === 'treatment' && id) {
    fetchTreatmentPlans();
  }
}, [activeTab, id]);
```

### Form State
```typescript
const [editData, setEditData] = useState({});

<input
  value={editData.firstName || ''}
  onChange={(e) => setEditData({ 
    ...editData, 
    firstName: e.target.value 
  })}
/>
```

## Validation

### Required Fields
```typescript
if (!data.firstName?.trim()) {
  setError('Nome é obrigatório');
  return;
}
```

### Email Validation
```typescript
if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
  setError('Email inválido');
  return;
}
```

## Navigation

### Programmatic Navigation
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

navigate('/admin/patients');
navigate(`/admin/patients/${id}`);
```

### Back Button
```typescript
<button onClick={() => navigate('/admin/patients')}>
  ← Voltar
</button>
```

## Best Practices

### 1. Always Handle Loading
```typescript
const [loading, setLoading] = useState(false);
```

### 2. Always Handle Errors
```typescript
const [error, setError] = useState(null);
```

### 3. Provide User Feedback
```typescript
alert('Salvo com sucesso!');
```

### 4. Validate Before Submit
```typescript
if (!isValid(data)) return;
```

### 5. Use Portuguese Messages
```typescript
setError('Erro ao carregar dados');
```

### 6. Implement Retry Logic
```typescript
<button onClick={fetchData}>Tentar Novamente</button>
```

### 7. Show Empty States
```typescript
{items.length === 0 && <p>Nenhum item encontrado</p>}
```

## Troubleshooting

### Component Not Rendering
- Check route configuration
- Verify patient ID in URL
- Check authentication

### Data Not Loading
- Verify API endpoint
- Check network tab
- Confirm authentication token

### Save Not Working
- Check validation
- Verify API response
- Check error state

### Styling Issues
- Verify inline styles
- Check parent container
- Test in different browsers

## Testing

### Unit Test Example
```typescript
import { render, screen } from '@testing-library/react';
import PatientDetail from './PatientDetail';

test('renders patient name', async () => {
  render(<PatientDetail />);
  await waitFor(() => {
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });
});
```

### Integration Test
```typescript
test('switches tabs', async () => {
  render(<PatientDetail />);
  fireEvent.click(screen.getByText('Odontograma'));
  await waitFor(() => {
    expect(screen.getByTestId('dental-chart')).toBeInTheDocument();
  });
});
```

## Support

For component issues:
1. Check props are correct
2. Verify data format
3. Check console for errors
4. Test in isolation
5. Review documentation
