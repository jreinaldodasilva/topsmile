
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
  const backendPatient: Partial<BackendPatient> = {
    ...patient,
    name: patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
    birthDate: (patient.dateOfBirth || patient.birthDate) ? (typeof (patient.dateOfBirth || patient.birthDate) === 'string' ? (patient.dateOfBirth || patient.birthDate) : (patient.dateOfBirth || patient.birthDate).toISOString()) : undefined,
  };

  delete (backendPatient as Partial<FrontendPatient>).firstName;
  delete (backendPatient as Partial<FrontendPatient>).lastName;
  delete (backendPatient as Partial<FrontendPatient>).dateOfBirth;
  delete (backendPatient as Partial<FrontendPatient>).fullName;
  delete (backendPatient as any).birthDate;


  return backendPatient;
};
