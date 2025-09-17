
import { Patient, Clinic } from '../types/api';

// FrontendPatient is the type used in the frontend components
// with optional fields for flexibility
interface FrontendPatient {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string | Date;
  birthDate?: string | Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  cpf?: string;
  rg?: string;
  address?: {
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
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
  clinic?: string | Clinic;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
}

type BackendPatient = Omit<FrontendPatient, 'firstName' | 'lastName' | 'dateOfBirth' | 'fullName' | 'birthDate'> & {
  name: string;
  birthDate: string;
};

export const toBackendPatient = (patient: FrontendPatient): Partial<BackendPatient> => {
  const dateValue = patient.dateOfBirth || patient.birthDate;
  let birthDate: string | undefined;
  if (dateValue) {
    if (typeof dateValue === 'string') {
      birthDate = dateValue;
    } else {
      birthDate = dateValue.toISOString();
    }
  }

  const backendPatient: Partial<BackendPatient> = {
    ...patient,
    name: patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
    birthDate,
  };

  delete (backendPatient as Partial<FrontendPatient>).firstName;
  delete (backendPatient as Partial<FrontendPatient>).lastName;
  delete (backendPatient as Partial<FrontendPatient>).dateOfBirth;
  delete (backendPatient as Partial<FrontendPatient>).fullName;

  return backendPatient;
};

export const fromBackendPatient = (backendPatient: BackendPatient): FrontendPatient => {
  const fullName = backendPatient.name;
  const nameParts = fullName?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    ...backendPatient,
    id: backendPatient._id,
    firstName,
    lastName,
    fullName,
    dateOfBirth: backendPatient.birthDate ? new Date(backendPatient.birthDate) : undefined,
  };
};
