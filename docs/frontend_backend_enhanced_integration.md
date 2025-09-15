// ========================================
// COMPREHENSIVE FRONTEND INTEGRATION UPDATES
// ========================================

// ========================================
// UPDATE #1: Enhanced API Service with Full Backend Integration
// File: src/services/apiService.ts
// ========================================

// ENHANCED: Full appointment management integration
const appointments = {
  // GET /api/appointments (backend pattern)
  async getAll(query: {
    startDate: string;
    endDate: string;
    providerId?: string;
    status?: string;
  }): Promise<ApiResult<Appointment[]>> {
    const qs = new URLSearchParams(query as any).toString();
    const res = await request(`/api/appointments?${qs}`);
    return { success: res.ok, data: res.data, message: res.message };
  },

  // GET /api/appointments/:id (backend pattern)
  async getOne(id: string): Promise<ApiResult<Appointment>> {
    const res = await request(`/api/appointments/${id}`);
    return { success: res.ok, data: res.data, message: res.message };
  },

  // POST /api/appointments/book (backend-specific endpoint)
  async book(payload: {
    patientId: string;
    providerId: string;
    appointmentTypeId: string;
    scheduledStart: string;
    notes?: string;
    priority?: 'routine' | 'urgent' | 'emergency';
  }): Promise<ApiResult<Appointment>> {
    const res = await request('/api/appointments/book', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return { success: res.ok, data: res.data, message: res.message };
  },

  // PATCH /api/appointments/:id/status (backend-specific)
  async updateStatus(id: string, status: string, cancellationReason?: string): Promise<ApiResult<Appointment>> {
    const res = await request(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, cancellationReason })
    });
    return { success: res.ok, data: res.data, message: res.message };
  },

  // PATCH /api/appointments/:id/reschedule (backend-specific)
  async reschedule(id: string, newStart: string, reason: string, rescheduleBy: 'patient' | 'clinic'): Promise<ApiResult<Appointment>> {
    const res = await request(`/api/appointments/${id}/reschedule`, {
      method: 'PATCH',
      body: JSON.stringify({ newStart, reason, rescheduleBy })
    });
    return { success: res.ok, data: res.data, message: res.message };
  },

  // GET /api/appointments/providers/:id/availability (backend-specific)
  async getProviderAvailability(providerId: string, date: string, appointmentTypeId: string): Promise<ApiResult<any[]>> {
    const res = await request(`/api/appointments/providers/${providerId}/availability?date=${date}&appointmentTypeId=${appointmentTypeId}`);
    return { success: res.ok, data: res.data, message: res.message };
  },

  // DELETE /api/appointments/:id (admin only)
  async delete(id: string): Promise<ApiResult<void>> {
    const res = await request(`/api/appointments/${id}`, { method: 'DELETE' });
    return { success: res.ok, data: res.data, message: res.message };
  }
};

// ENHANCED: Patient management with backend-specific features
const patients = {
  // GET /api/patients with backend pagination format
  async getAll(query: {
    search?: string;
    status?: 'active' | 'inactive';
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<ApiResult<{
    patients: Patient[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>> {
    const qs = Object.keys(query).length
      ? `?${new URLSearchParams(query as any).toString()}`
      : '';
    const res = await request(`/api/patients${qs}`);
    return { success: res.ok, data: res.data, message: res.message };
  },

  async getOne(id: string): Promise<ApiResult<Patient>> {
    const res = await request(`/api/patients/${id}`);
    return { success: res.ok, data: res.data, message: res.message };
  },

  async create(payload: Partial<Patient>): Promise<ApiResult<Patient>> {
    // Map frontend fields to backend format
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
    
    const res = await request('/api/patients', {
      method: 'POST',
      body: JSON.stringify(backendPayload)
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
  },

  async update(id: string, payload: Partial<Patient>): Promise<ApiResult<Patient>> {
    // Same mapping logic as create
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
      medicalHistory: payload.medicalHistory,
      status: payload.status || payload.isActive ? 'active' : 'inactive'
    };
    
    const res = await request(`/api/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(backendPayload)
    });
    
    // Transform response
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
  },

  // BACKEND-SPECIFIC: Update medical history
  async updateMedicalHistory(id: string, medicalHistory: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    notes?: string;
  }): Promise<ApiResult<Patient>> {
    const res = await request(`/api/patients/${id}/medical-history`, {
      method: 'PATCH',
      body: JSON.stringify(medicalHistory)
    });
    return { success: res.ok, data: res.data, message: res.message };
  },

  // BACKEND-SPECIFIC: Reactivate patient
  async reactivate(id: string): Promise<ApiResult<Patient>> {
    const res = await request(`/api/patients/${id}/reactivate`, {
      method: 'PATCH'
    });
    return { success: res.ok, data: res.data, message: res.message };
  },

  // BACKEND-SPECIFIC: Get patient statistics
  async getStats(): Promise<ApiResult<{
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
  }>> {
    const res = await request('/api/patients/stats');
    return { success: res.ok, data: res.data, message: res.message };
  },

  async delete(id: string): Promise<ApiResult<void>> {
    const res = await request(`/api/patients/${id}`, { method: 'DELETE' });
    return { success: res.ok, data: res.data, message: res.message };
  }
};

// ENHANCED: Updated API service export with all backend integrations
export const apiService = {
  auth: {
    login,
    register,
    me,
    refreshToken,
    logout
  },
  
  // FIXED: Patient auth with correct endpoints
  patientAuth: {
    login: async (email: string, password: string) => {
      const res = await request('/api/patient/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        auth: false
      });
      return { success: res.ok, data: res.data, message: res.message };
    },
    register: async (data: { patientId: string; email: string; password: string }) => {
      const res = await request('/api/patient/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        auth: false
      });
      return { success: res.ok, data: res.data, message: res.message };
    },
    me: async () => {
      const res = await request('/api/patient/auth/me');
      return { success: res.ok, data: res.data, message: res.message };
    },
    refreshToken: async (refreshToken: string) => {
      const res = await request('/api/patient/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        auth: false
      });
      return { success: res.ok, data: res.data, message: res.message };
    },
    logout: async () => {
      const res = await request('/api/patient/auth/logout', { method: 'POST' });
      return { success: res.ok, data: res.data, message: res.message };
    }
  },
  
  contacts: {
    getAll: getContacts,
    getOne: getContact,
    create: createContact,
    update: updateContact,
    delete: deleteContact,
    getStats: getContactStats,
    batchUpdate: batchUpdateContacts,
    findDuplicates: findDuplicateContacts,
    mergeDuplicates: mergeDuplicateContacts
  },
  
  appointments, // Enhanced appointment service
  patients,     // Enhanced patient service
  
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
  
  health: {
    getStatus: async () => {
      const res = await request('/api/health', { auth: false });
      return { success: res.ok, data: res.data, message: res.message };
    }
  }
};

// ========================================
// UPDATE #2: Enhanced HTTP Service with Better Error Handling
// File: src/services/http.ts
// ========================================

// ENHANCED: Better response parsing for backend format variations
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
      message: payload?.message || res.statusText,
      // ADDED: Include error codes and validation errors from backend
      code: payload?.code,
      errors: payload?.errors
    };
  }

  return { 
    ok: true, 
    status: res.status, 
    // Backend sometimes wraps in 'data', sometimes doesn't
    data: payload?.data !== undefined ? payload.data : payload, 
    message: payload?.message 
  };
}

// ENHANCED: Better token refresh with backend error codes
async function performRefresh(): Promise<void> {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) throw new Error('No refresh token available');

  const url = `${API_BASE_URL}/api/auth/refresh`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  const parsedResponse = await parseResponse(res);

  if (!parsedResponse.ok) {
    // Clear tokens on refresh failure
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    
    // Handle specific backend error codes
    if (parsedResponse.code === 'TOKEN_EXPIRED' || parsedResponse.code === 'INVALID_TOKEN') {
      // Trigger storage event to logout across tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: ACCESS_KEY,
        newValue: null,
        oldValue: localStorage.getItem(ACCESS_KEY)
      }));
    }
    
    throw new Error(parsedResponse.message || 'Failed to refresh token');
  }

  const { data } = parsedResponse;
  if (!data?.accessToken || !data?.refreshToken) {
    throw new Error('Refresh response missing tokens');
  }

  localStorage.setItem(ACCESS_KEY, data.accessToken);
  localStorage.setItem(REFRESH_KEY, data.refreshToken);
}

// ENHANCED: Request function with better clinic access handling
export async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<HttpResponse<T>> {
  const { auth = true, ...restOfOptions } = options;

  const makeRequest = async (token?: string | null) => {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(restOfOptions.headers || {})
    });

    if (auth && token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...restOfOptions,
      headers,
      body: restOfOptions.body ?? undefined
    };

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    try {
      const res = await fetch(url, config);
      return res;
    } catch (networkError) {
      throw new Error('Network error - please check your connection');
    }
  };

  try {
    const accessToken = localStorage.getItem(ACCESS_KEY);
    const res = await makeRequest(accessToken);
    
    // If not 401, return the response
    if (res.status !== 401) {
      return (await parseResponse(res)) as HttpResponse<T>;
    }

    // Handle 401 - try refresh flow
    if (!refreshingPromise) {
      refreshingPromise = performRefresh()
        .catch((err) => {
          refreshingPromise = null;
          throw err;
        })
        .finally(() => {
          refreshingPromise = null;
        });
    }

    await refreshingPromise;

    // Retry original request with new access token
    const newAccess = localStorage.getItem(ACCESS_KEY);
    const retryRes = await makeRequest(newAccess);
    return (await parseResponse(retryRes)) as HttpResponse<T>;
    
  } catch (err: any) {
    // Enhanced error handling for backend-specific errors
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    
    if (err instanceof Error) {
      throw err;
    }

    throw new Error('An unknown network error occurred');
  }
}

// ========================================
// UPDATE #3: Enhanced Auth Context with Backend Integration
// File: src/contexts/AuthContext.tsx
// ========================================

const login = async (email: string, password: string): Promise<AuthResult> => {
  try {
    setError(null);
    setLoading(true);

    const response = await apiService.auth.login(email, password);

    if (response.success && response.data) {
      const { user, accessToken, refreshToken } = response.data;
      
      // Store tokens
      localStorage.setItem(ACCESS_KEY, accessToken);
      localStorage.setItem(REFRESH_KEY, refreshToken);
      
      // Update state
      setAccessToken(accessToken);
      setUser(user);
      setLogoutReason(null);
      
      // Navigate based on user role and clinic access
      const redirectPath = getRedirectPath(user.role, user.clinicId);
      navigate(redirectPath);
      
      return { success: true };
    } else {
      // ENHANCED: Handle backend validation errors
      let errorMsg = response.message || 'E-mail ou senha inválidos';
      
      // Handle validation errors from backend
      if (response.errors && Array.isArray(response.errors)) {
        errorMsg = response.errors.map(err => err.msg || err.message).join(', ');
      }
      
      // Handle specific backend error codes
      if (response.code === 'USER_INACTIVE') {
        errorMsg = 'Sua conta está inativa. Entre em contato com o administrador.';
      } else if (response.code === 'NO_CLINIC_ASSOCIATION') {
        errorMsg = 'Sua conta não está associada a uma clínica. Entre em contato com o suporte.';
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

// ENHANCED: Redirect path with clinic consideration
function getRedirectPath(role?: string, clinicId?: string): string {
  // Check if user has clinic access
  if (!clinicId && role !== 'super_admin') {
    return '/unauthorized?reason=no_clinic';
  }
  
  switch (role) {
    case 'super_admin':
      return '/admin';
    case 'admin':
    case 'manager':
      return '/admin';
    case 'dentist':
      return '/admin/appointments';
    case 'assistant':
      return '/admin/appointments';
    default:
      return '/admin';
  }
}

// ========================================
// UPDATE #4: Enhanced Patient Auth Context
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
      } else {
        // Email verification required
        navigate('/patient/login', {
          state: { message: 'Verifique seu e-mail para ativar a conta.' }
        });
        return { success: true, message: response.message };
      }
    } else {
      // ENHANCED: Handle backend validation errors
      let errorMsg = response.message || 'E-mail ou senha inválidos';
      
      if (response.errors && Array.isArray(response.errors)) {
        errorMsg = response.errors.map(err => err.msg || err.message).join(', ');
      }
      
      // Handle specific patient auth error codes
      if (response.code === 'ACCOUNT_LOCKED') {
        errorMsg = 'Conta bloqueada por muitas tentativas. Tente novamente mais tarde.';
      } else if (response.code === 'EMAIL_NOT_VERIFIED') {
        errorMsg = 'Verifique seu e-mail antes de fazer login.';
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
// UPDATE #5: Enhanced Types with Backend Schema
// File: src/types/api.ts
// ========================================

// ENHANCED: Complete Contact type with all backend fields
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
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  assignedTo?: string | User;
  assignedToClinic?: string;
  followUpDate?: string | Date | null;
  
  // Backend-specific fields
  leadScore?: number;
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
  
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;
  deletedBy?: string;
  mergedInto?: string;
  
  [key: string]: any;
};

// ENHANCED: Patient type with backend field mapping
export type Patient = {
  id?: string;
  _id?: string;
  
  // Frontend fields
  firstName?: string;
  lastName?: string;
  fullName?: string;
  dateOfBirth?: string | Date;
  
  // Backend fields (primary)
  name?: string;        // Backend uses single name field
  birthDate?: string | Date; // Backend uses birthDate
  
  // Common fields
  email?: string;
  phone: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  cpf?: string;
  
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  
  clinic: string | Clinic;
  
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  
  medicalHistory?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    notes?: string;
  };
  
  status?: 'active' | 'inactive';
  isActive?: boolean; // Frontend compatibility
  
  createdAt?: string | Date;
  updatedAt?: string | Date;
  
  [key: string]: any;
};

// ENHANCED: Appointment type with full backend schema
export type Appointment = {
  id?: string;
  _id?: string;
  patient: string | Patient;
  clinic: string | Clinic;
  provider: string | Provider;
  appointmentType: string | AppointmentType;
  scheduledStart: string | Date;
  scheduledEnd: string | Date;
  actualStart?: string | Date;
  actualEnd?: string | Date;
  status: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  priority?: 'routine' | 'urgent' | 'emergency';
  notes?: string;
  privateNotes?: string;
  
  // Backend-specific fields
  remindersSent?: {
    confirmation: boolean;
    reminder24h: boolean;
    reminder2h: boolean;
  };
  cancellationReason?: string;
  rescheduleHistory?: Array<{
    oldDate: Date;
    newDate: Date;
    reason: string;
    rescheduleBy: 'patient' | 'clinic';
    timestamp: Date;
  }>;
  checkedInAt?: Date;
  completedAt?: Date;
  duration?: number;
  waitTime?: number;
  
  createdBy: string | User;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  
  [key: string]: any;
};

// ENHANCED: API response types with backend error handling
export type ApiResult<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  code?: string; // Backend error codes
  errors?: Array<{ msg: string; param: string; value?: any }>; // Validation errors
};

// ENHANCED: HTTP response with error details
export interface HttpResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  message?: string;
  code?: string;
  errors?: Array<{ msg: string; param: string; value?: any }>;
}

// ========================================
// DEPLOYMENT INSTRUCTIONS
// ========================================

/*
CRITICAL DEPLOYMENT CHECKLIST:

1. Backend Route Mounting (REQUIRED FOR ADMIN DASHBOARD):
   Add to backend/src/app.ts:
   ```
   import adminRoutes from './routes/admin/contacts';
   app.use('/api/admin', adminRoutes);
   ```

2. Frontend Files to Update:
   - src/services/apiService.ts (CRITICAL - patient auth endpoints)
   - src/services/http.ts (error handling enhancement)
   - src/contexts/AuthContext.tsx (backend error handling)
   - src/contexts/PatientAuthContext.tsx (endpoint fixes)
   - src/types/api.ts (field mapping updates)

3. Test Critical Flows:
   - Admin login → dashboard access
   - Patient registration → login flow
   - Contact CRUD operations
   - Appointment booking flow
   - Error handling scenarios

4. Environment Variables:
   Ensure REACT_APP_API_URL points to correct backend URL

5. Backend Integration Verification:
   - Verify JWT tokens include clinicId
   - Test role-based access controls
   - Confirm data isolation by clinic

ESTIMATED DEPLOYMENT TIME: 4-6 hours including testing

PRIORITY ORDER:
1. Fix patient auth endpoints (CRITICAL)
2. Add admin route mounting (CRITICAL)
3. Enhance error handling (HIGH)
4. Update field mappings (HIGH)
5. Add advanced features (MEDIUM)
*/