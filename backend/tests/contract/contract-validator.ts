import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { 
  patientSchema, 
  appointmentSchema, 
  userSchema, 
  apiResponseSchema, 
  errorResponseSchema 
} from './schemas';

/**
 * Contract validation utilities for API testing
 */

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Compile schemas
const validators = {
  patient: ajv.compile(patientSchema),
  appointment: ajv.compile(appointmentSchema),
  user: ajv.compile(userSchema),
  apiResponse: ajv.compile(apiResponseSchema),
  errorResponse: ajv.compile(errorResponseSchema)
};

export class ContractValidator {
  static validatePatient(data: any): { valid: boolean; errors?: any[] } {
    const valid = validators.patient(data);
    return {
      valid,
      errors: valid ? undefined : validators.patient.errors
    };
  }

  static validateAppointment(data: any): { valid: boolean; errors?: any[] } {
    const valid = validators.appointment(data);
    return {
      valid,
      errors: valid ? undefined : validators.appointment.errors
    };
  }

  static validateUser(data: any): { valid: boolean; errors?: any[] } {
    const valid = validators.user(data);
    return {
      valid,
      errors: valid ? undefined : validators.user.errors
    };
  }

  static validateApiResponse(data: any): { valid: boolean; errors?: any[] } {
    const valid = validators.apiResponse(data);
    return {
      valid,
      errors: valid ? undefined : validators.apiResponse.errors
    };
  }

  static validateErrorResponse(data: any): { valid: boolean; errors?: any[] } {
    const valid = validators.errorResponse(data);
    return {
      valid,
      errors: valid ? undefined : validators.errorResponse.errors
    };
  }

  static validateResponseWithData(response: any, dataType: 'patient' | 'appointment' | 'user'): {
    valid: boolean;
    errors?: string[];
  } {
    const errors: string[] = [];

    // Validate overall response structure
    const responseValidation = this.validateApiResponse(response);
    if (!responseValidation.valid) {
      errors.push('Invalid API response structure');
      if (responseValidation.errors) {
        errors.push(...responseValidation.errors.map(e => `Response: ${e.instancePath} ${e.message}`));
      }
    }

    // Validate data based on type
    if (response.data) {
      let dataValidation;
      
      if (Array.isArray(response.data)) {
        // Validate each item in array
        response.data.forEach((item: any, index: number) => {
          switch (dataType) {
            case 'patient':
              dataValidation = this.validatePatient(item);
              break;
            case 'appointment':
              dataValidation = this.validateAppointment(item);
              break;
            case 'user':
              dataValidation = this.validateUser(item);
              break;
          }
          
          if (!dataValidation.valid && dataValidation.errors) {
            errors.push(`Item ${index}: ${dataValidation.errors.map(e => `${e.instancePath} ${e.message}`).join(', ')}`);
          }
        });
      } else {
        // Validate single item
        switch (dataType) {
          case 'patient':
            dataValidation = this.validatePatient(response.data);
            break;
          case 'appointment':
            dataValidation = this.validateAppointment(response.data);
            break;
          case 'user':
            dataValidation = this.validateUser(response.data);
            break;
        }
        
        if (!dataValidation.valid && dataValidation.errors) {
          errors.push(...dataValidation.errors.map(e => `Data: ${e.instancePath} ${e.message}`));
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}

// Jest custom matchers for contract validation
declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchPatientContract(): R;
      toMatchAppointmentContract(): R;
      toMatchUserContract(): R;
      toMatchApiResponseContract(): R;
      toMatchErrorResponseContract(): R;
    }
  }
}

expect.extend({
  toMatchPatientContract(received: any) {
    const result = ContractValidator.validatePatient(received);
    return {
      message: () => `Expected patient data to match contract. Errors: ${JSON.stringify(result.errors)}`,
      pass: result.valid
    };
  },

  toMatchAppointmentContract(received: any) {
    const result = ContractValidator.validateAppointment(received);
    return {
      message: () => `Expected appointment data to match contract. Errors: ${JSON.stringify(result.errors)}`,
      pass: result.valid
    };
  },

  toMatchUserContract(received: any) {
    const result = ContractValidator.validateUser(received);
    return {
      message: () => `Expected user data to match contract. Errors: ${JSON.stringify(result.errors)}`,
      pass: result.valid
    };
  },

  toMatchApiResponseContract(received: any) {
    const result = ContractValidator.validateApiResponse(received);
    return {
      message: () => `Expected API response to match contract. Errors: ${JSON.stringify(result.errors)}`,
      pass: result.valid
    };
  },

  toMatchErrorResponseContract(received: any) {
    const result = ContractValidator.validateErrorResponse(received);
    return {
      message: () => `Expected error response to match contract. Errors: ${JSON.stringify(result.errors)}`,
      pass: result.valid
    };
  }
});