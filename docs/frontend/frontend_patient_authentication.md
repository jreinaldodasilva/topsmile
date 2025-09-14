// ========================================
// CRITICAL FIX #1: Patient Auth API Endpoints
// File: src/services/apiService.ts
// ========================================

// ADD: Patient Authentication API methods with correct endpoints
async function patientLogin(email: string, password: string): Promise<ApiResult<{
  patientUser: any;
  accessToken: string;
  refreshToken: string;
}>> {
  const res = await request('/api/patient/auth/login', {  // FIXED: Correct endpoint
    method: 'POST',
    body: JSON.stringify({ email, password }),
    auth: false
  });
  return { success: res.ok, data: res.data, message: res.message };
}

async function patientRegister(data: {
  patientId: string;
  email: string;
  password: string;
}): Promise<ApiResult<{
  patientUser: any;
  accessToken?: string;
  refreshToken?: string;
}>> {
  const res = await request('/api/patient/auth/register', {  // FIXED: Correct endpoint
    method: 'POST',
    body: JSON.stringify(data),
    auth: false
  });
  return { success: res.ok, data: res.data, message: res.message };
}

async function patientMe(): Promise<ApiResult<{ patientUser: any }>> {
  const res = await request('/api/patient/auth/me');  // FIXED: Correct endpoint
  return { success: res.ok, data: res.data, message: res.message };
}

async function patientRefreshToken(refreshToken: string): Promise<ApiResult<{
  accessToken: string;
  refreshToken: string;
}>> {
  const res = await request('/api/patient/auth/refresh', {  // FIXED: Correct endpoint
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
    auth: false
  });
  return { success: res.ok, data: res.data, message: res.message };
}

async function patientLogout(): Promise<ApiResult<void>> {
  const res = await request('/api/patient/auth/logout', {  // FIXED: Correct endpoint
    method: 'POST'
  });
  return { success: res.ok, data: res.data, message: res.message };
}

// ========================================
// CRITICAL FIX #2: Enhanced API Service Export
// File: src/services/apiService.ts
// ========================================

export const apiService = {
  auth: {
    login,
    register,
    me,
    refreshToken,
    logout
  },
  
  // ADDED: Patient auth service (was missing/broken)
  patientAuth: {
    login: patientLogin,
    register: patientRegister,
    me: patientMe,
    refreshToken: patientRefreshToken,
    logout: patientLogout
  },
  
  contacts: {
    getAll: getContacts,
    getOne: getContact,
    create: createContact,
    update: updateContact,
    delete: deleteContact,
    getStats: getContactStats,
    
    // ADDED: Advanced contact operations backend supports
    batchUpdate: async (contactIds: string[], updates: any) => {
      const res = await request('/api/admin/contacts/batch', {
        method: 'PATCH',
        body: JSON.stringify({ contactIds, updates })
      });
      return { success: res.ok, data: res.data, message: res.message };
    },
    
    findDuplicates: async () => {
      const res = await request('/api/admin/contacts/duplicates');
      return { success: res.ok, data: res.data, message: res.message };
    },
    
    mergeDuplicates: async (primaryId: string, duplicateIds: string[]) => {
      const res = await request('/api/admin/contacts/merge', {
        method: 'POST',
        body: JSON.stringify({ primaryContactId: primaryId, duplicateContactIds: duplicateIds })
      });
      return { success: res.ok, data: res.data, message: res.message };
    }
  },
  
  appointments: {
    getAll: getAppointments,
    getOne: getAppointment,
    create: createAppointment,
    update: updateAppointment,
    delete: deleteAppointment
  },
  
  patients: {
    getAll: getPatients,
    getOne: getPatient,
    create: createPatient,
    update: updatePatient,
    delete: deletePatient
  },
  
  providers: {
    getAll: getProviders,
    getOne: getProvider,
    create: createProvider,
    update: updateProvider,
    delete: deleteProvider
  },
  
  dashboard: {
    getStats: getDashboardStats
  },
  
  public: {
    sendContactForm
  },
  
  // ADDED: Health check services
  health: {
    async getStatus(): Promise<ApiResult<any>> {
      const res = await request('/api/health', { auth: false });
      return { success: res.ok, data: res.data, message: res.message };
    },
    
    async getDatabaseHealth(): Promise<ApiResult<any>> {
      const res = await request('/api/health/database', { auth: false });
      return { success: res.ok, data: res.data, message: res.message };
    }
  }
};

// ========================================
// CRITICAL FIX #3: Enhanced Response Parsing
// File: src/services/http.ts
// ========================================

async function parseResponse(res: Response): Promise<HttpResponse> {
  const text = await res.text();
  let payload: any = undefined;
  
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (e) {
      payload = { message: text };
    }
  }

  if (!res.ok) {
    return { 
      ok: false, 
      status: res.status, 
      data: payload?.data, 
      message: payload?.message || res.statusText 
    };
  }

  // ENHANCED: Handle multiple backend response formats
  return { 
    ok: true, 
    status: res.status, 
    // Backend sometimes wraps data, sometimes returns it directly
    data: payload?.data !== undefined ? payload.data : payload, 
    message: payload?.message 
  };
}

// ========================================
// CRITICAL FIX #4: Enhanced Error Handling
// File: src/contexts/PatientAuthContext.tsx
// ========================================

const login = async (email: string, password: string): Promise<PatientAuthResult> => {
  try {
    setError(null);
    setLoading(true);

    const response = await apiService.patientAuth.login(email, password);

    if (response.success && response.data) {
      const { patientUser, accessToken, refreshToken } = response.data;

      if (accessToken && refreshToken) {
        localStorage.setItem(ACCESS_KEY, accessToken);
        localStorage.setItem(REFRESH_KEY, refreshToken);

        setAccessToken(accessToken);
        setPatientUser(patientUser);

        navigate('/patient/dashboard');
        return { success: true };
      }
    } else {
      // ENHANCED: Handle backend validation errors properly
      let errorMsg = response.message || 'E-mail ou senha inválidos';
      
      // Handle validation errors array from backend
      if (response.data?.errors && Array.isArray(response.data.errors)) {
        errorMsg = response.data.errors.map((err: any) => err.msg || err.message).join(', ');
      }
      
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  } catch (err: any) {
    const errorMsg = err.message || 'Erro de rede. Tente novamente.';
    setError(errorMsg);
    return { success: false, message: errorMsg };
  } finally {
    setLoading(false);
  }
};

// ========================================
// CRITICAL FIX #5: Updated Contact Type
// File: src/types/api.ts
// ========================================

export type Contact = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  clinic: string;
  specialty: string;
  phone: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed' | 'deleted' | 'merged';
  source?: 'website_contact_form' | 'phone' | 'email' | 'referral' | 'social_media' | 'advertisement' | string;
  
  // ADDED: Backend supports these additional fields
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  assignedTo?: string | User;
  assignedToClinic?: string;
  followUpDate?: string | Date | null;
  
  // Advanced tracking fields from backend
  leadScore?: number; // 0-100 scoring system
  lastContactedAt?: string | Date;
  conversionDetails?: {
    convertedAt: Date;
    convertedBy: string;
    conversionNotes: string;
    estimatedValue?: number;
  };
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
  
  // Standard timestamps
  createdAt?: string | Date;
  updatedAt?: string | Date;
  
  // Soft delete support
  deletedAt?: string | Date;
  deletedBy?: string;
  mergedInto?: string; // If this contact was merged into another
  
  [key: string]: any;
};

// ========================================
// CRITICAL FIX #6: Patient Data Mapping Fix
// File: src/services/apiService.ts - Patient Methods
// ========================================

async function createPatient(payload: Partial<Patient>): Promise<ApiResult<Patient>> {
    // FIXED: Map frontend fields to backend expectations
    const backendPayload = {
        // Backend expects single 'name' field, not firstName/lastName split
        name: payload.firstName 
          ? `${payload.firstName} ${payload.lastName || ''}`.trim() 
          : payload.fullName || payload.name,
        
        email: payload.email,
        phone: payload.phone,
        
        // FIXED: Backend uses 'birthDate' not 'dateOfBirth'
        birthDate: payload.dateOfBirth,
        
        // FIXED: Handle gender mapping
        gender: payload.gender === 'prefer_not_to_say' ? undefined : payload.gender,
        
        cpf: payload.cpf,
        address: payload.address,
        emergencyContact: payload.emergencyContact,
        medicalHistory: payload.medicalHistory
    };
    
    const res = await request<Patient>('/api/patients', {
        method: 'POST',
        body: JSON.stringify(backendPayload),
    });
    
    // ENHANCED: Transform response back to frontend format
    if (res.data && typeof res.data === 'object') {
      const patient = res.data as any;
      if (patient.name && !patient.firstName) {
        const nameParts = patient.name.split(' ');
        patient.firstName = nameParts[0];
        patient.lastName = nameParts.slice(1).join(' ');
        patient.fullName = patient.name;
      }
      if (patient.birthDate && !patient.dateOfBirth) {
        patient.dateOfBirth = patient.birthDate;
      }
    }
    
    return { success: res.ok, data: res.data, message: res.message };
}

async function updatePatient(id: string, payload: Partial<Patient>): Promise<ApiResult<Patient>> {
    // Same mapping logic as createPatient
    const backendPayload = {
        name: payload.firstName 
          ? `${payload.firstName} ${payload.lastName || ''}`.trim() 
          : payload.fullName || payload.name,
        email: payload.email,
        phone: payload.phone,
        birthDate: payload.dateOfBirth,
        gender: payload.gender === 'prefer_not_to_say' ? undefined : payload.gender,
        cpf: payload.cpf,
        address: payload.address,
        emergencyContact: payload.emergencyContact,
        medicalHistory: payload.medicalHistory
    };
    
    const res = await request<Patient>(`/api/patients/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(backendPayload),
    });
    
    // Transform response back to frontend format
    if (res.data && typeof res.data === 'object') {
      const patient = res.data as any;
      if (patient.name && !patient.firstName) {
        const nameParts = patient.name.split(' ');
        patient.firstName = nameParts[0];
        patient.lastName = nameParts.slice(1).join(' ');
        patient.fullName = patient.name;
      }
      if (patient.birthDate && !patient.dateOfBirth) {
        patient.dateOfBirth = patient.birthDate;
      }
    }
    
    return { success: res.ok, data: res.data, message: res.message };
}

// ========================================
// IMPLEMENTATION NOTES
// ========================================

/*
DEPLOYMENT CHECKLIST:

1. Update src/services/apiService.ts:
   - Fix patient auth endpoints
   - Add enhanced contact operations
   - Fix patient data field mapping
   - Add health check services

2. Update src/services/http.ts:
   - Enhance parseResponse function
   - Add better error handling

3. Update src/contexts/PatientAuthContext.tsx:
   - Fix API service calls
   - Add validation error handling

4. Update src/types/api.ts:
   - Enhance Contact type with backend fields
   - Add missing type definitions

5. Backend Integration Check:
   - Ensure /api/admin routes are mounted in app.ts
   - Verify all endpoints return expected response format
   - Test patient auth flow end-to-end

6. Test All Critical Flows:
   - Admin login and dashboard access
   - Patient registration and login
   - Contact CRUD operations
   - Error handling scenarios

PRIORITY ORDER:
1. Patient auth endpoints (breaks patient portal completely)
2. API response parsing (affects all error handling)
3. Contact type updates (improves admin functionality)
4. Patient data mapping (fixes patient management)
5. Advanced features (enhances user experience)

ESTIMATED TIME: 2-4 hours for critical fixes
*/