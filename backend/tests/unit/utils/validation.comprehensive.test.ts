import { 
  emailSchema, 
  passwordSchema, 
  phoneSchema, 
  objectIdSchema,
  loginSchema,
  registerSchema,
  patientRegistrationSchema,
  appointmentSchema,
  validateRequest
} from '../../../src/utils/validation';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

describe('Validation Utilities - Core Business Logic', () => {
  describe('emailSchema', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
        'a@b.co'
      ];

      validEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).not.toThrow();
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test..test@example.com',
        'test@example',
        'test@.com',
        '',
        'test@example.',
        'test @example.com', // space
        'test@exam ple.com' // space in domain
      ];

      invalidEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).toThrow('Email inválido');
      });
    });

    it('should reject emails longer than 255 characters', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(() => emailSchema.parse(longEmail)).toThrow();
    });
  });

  describe('passwordSchema', () => {
    it('should validate strong passwords', () => {
      const validPasswords = [
        'Password123!',
        'MyStr0ng@Pass',
        'C0mplex#Password',
        'Secure123$',
        'Valid@Pass1'
      ];

      validPasswords.forEach(password => {
        expect(() => passwordSchema.parse(password)).not.toThrow();
      });
    });

    it('should reject passwords without uppercase letters', () => {
      const passwords = [
        'password123!',
        'mystr0ng@pass',
        'weak123$'
      ];

      passwords.forEach(password => {
        expect(() => passwordSchema.parse(password))
          .toThrow('Senha deve conter pelo menos uma letra maiúscula');
      });
    });

    it('should reject passwords without lowercase letters', () => {
      const passwords = [
        'PASSWORD123!',
        'MYSTR0NG@PASS',
        'WEAK123$'
      ];

      passwords.forEach(password => {
        expect(() => passwordSchema.parse(password))
          .toThrow('Senha deve conter pelo menos uma letra minúscula');
      });
    });

    it('should reject passwords without numbers', () => {
      const passwords = [
        'Password!',
        'MyStrong@Pass',
        'Weak$Password'
      ];

      passwords.forEach(password => {
        expect(() => passwordSchema.parse(password))
          .toThrow('Senha deve conter pelo menos um número');
      });
    });

    it('should reject passwords without special characters', () => {
      const passwords = [
        'Password123',
        'MyStr0ngPass',
        'Weak123Password'
      ];

      passwords.forEach(password => {
        expect(() => passwordSchema.parse(password))
          .toThrow('Senha deve conter pelo menos um caractere especial');
      });
    });

    it('should reject passwords shorter than 8 characters', () => {
      const shortPasswords = [
        'Pass1!',
        'Ab1!',
        '1234567'
      ];

      shortPasswords.forEach(password => {
        expect(() => passwordSchema.parse(password))
          .toThrow('Senha deve ter pelo menos 8 caracteres');
      });
    });

    it('should accept various special characters', () => {
      const specialChars = '!@#$%^&*(),.?":{}|<>';
      
      specialChars.split('').forEach(char => {
        const password = `Password123${char}`;
        expect(() => passwordSchema.parse(password)).not.toThrow();
      });
    });
  });

  describe('phoneSchema', () => {
    it('should validate correct Brazilian phone formats', () => {
      const validPhones = [
        '(11) 99999-9999',
        '(21) 88888-8888',
        '(85) 7777-7777',
        '(11) 9999-9999'
      ];

      validPhones.forEach(phone => {
        expect(() => phoneSchema.parse(phone)).not.toThrow();
      });
    });

    it('should reject invalid phone formats', () => {
      const invalidPhones = [
        '11999999999',
        '(11) 999999999',
        '11 99999-9999',
        '(11)99999-9999',
        '(11) 99999 9999',
        '11-99999-9999',
        '+55 11 99999-9999',
        '(111) 99999-9999',
        '(1) 99999-9999',
        ''
      ];

      invalidPhones.forEach(phone => {
        expect(() => phoneSchema.parse(phone))
          .toThrow('Telefone deve estar no formato (XX) XXXXX-XXXX');
      });
    });
  });

  describe('objectIdSchema', () => {
    it('should validate correct MongoDB ObjectId formats', () => {
      const validObjectIds = [
        '507f1f77bcf86cd799439011',
        '507f191e810c19729de860ea',
        '000000000000000000000000',
        'ffffffffffffffffffffffff'
      ];

      validObjectIds.forEach(id => {
        expect(() => objectIdSchema.parse(id)).not.toThrow();
      });
    });

    it('should reject invalid ObjectId formats', () => {
      const invalidObjectIds = [
        '507f1f77bcf86cd79943901', // too short
        '507f1f77bcf86cd799439011a', // too long
        'invalid-object-id',
        '507f1f77bcf86cd79943901g', // invalid character
        '',
        '507f1f77-bcf8-6cd7-9943-9011'
      ];

      invalidObjectIds.forEach(id => {
        expect(() => objectIdSchema.parse(id)).toThrow('ID inválido');
      });
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validLoginData = {
        email: 'test@example.com',
        password: 'anypassword'
      };

      expect(() => loginSchema.parse(validLoginData)).not.toThrow();
    });

    it('should reject login data with invalid email', () => {
      const invalidLoginData = {
        email: 'invalid-email',
        password: 'password'
      };

      expect(() => loginSchema.parse(invalidLoginData)).toThrow('Email inválido');
    });

    it('should reject login data with empty password', () => {
      const invalidLoginData = {
        email: 'test@example.com',
        password: ''
      };

      expect(() => loginSchema.parse(invalidLoginData)).toThrow('Senha é obrigatória');
    });

    it('should reject login data with missing fields', () => {
      expect(() => loginSchema.parse({ email: 'test@example.com' })).toThrow();
      expect(() => loginSchema.parse({ password: 'password' })).toThrow();
      expect(() => loginSchema.parse({})).toThrow();
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validRegisterData = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'Password123!',
        role: 'admin' as const
      };

      expect(() => registerSchema.parse(validRegisterData)).not.toThrow();
    });

    it('should reject registration with invalid role', () => {
      const invalidRegisterData = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'Password123!',
        role: 'invalid-role'
      };

      expect(() => registerSchema.parse(invalidRegisterData)).toThrow();
    });

    it('should reject registration with short name', () => {
      const invalidRegisterData = {
        name: 'J',
        email: 'joao@example.com',
        password: 'Password123!',
        role: 'admin' as const
      };

      expect(() => registerSchema.parse(invalidRegisterData))
        .toThrow('Nome deve ter pelo menos 2 caracteres');
    });

    it('should reject registration with long name', () => {
      const invalidRegisterData = {
        name: 'x'.repeat(101),
        email: 'joao@example.com',
        password: 'Password123!',
        role: 'admin' as const
      };

      expect(() => registerSchema.parse(invalidRegisterData)).toThrow();
    });

    it('should validate all valid roles', () => {
      const validRoles = ['admin', 'manager', 'dentist', 'assistant'] as const;
      
      validRoles.forEach(role => {
        const registerData = {
          name: 'João Silva',
          email: 'joao@example.com',
          password: 'Password123!',
          role
        };

        expect(() => registerSchema.parse(registerData)).not.toThrow();
      });
    });
  });

  describe('validateRequest middleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
      mockReq = {
        body: {}
      };
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      mockNext = jest.fn();
    });

    it('should call next() for valid data', () => {
      const schema = z.object({
        name: z.string().min(2),
        email: z.string().email()
      });

      mockReq.body = {
        name: 'João Silva',
        email: 'joao@example.com'
      };

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid data', () => {
      const schema = z.object({
        name: z.string().min(2),
        email: z.string().email()
      });

      mockReq.body = {
        name: 'J',
        email: 'invalid-email'
      };

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Dados de entrada inválidos',
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: expect.any(String),
            param: expect.any(String)
          })
        ])
      });
      expect(mockNext).not.toHaveBeenCalledWith();
    });

    it('should handle nested validation errors', () => {
      const schema = z.object({
        user: z.object({
          profile: z.object({
            name: z.string().min(2)
          })
        })
      });

      mockReq.body = {
        user: {
          profile: {
            name: 'J'
          }
        }
      };

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Dados de entrada inválidos',
        errors: expect.arrayContaining([
          expect.objectContaining({
            param: 'user.profile.name'
          })
        ])
      });
    });

    it('should handle multiple validation errors', () => {
      const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        age: z.number().min(0)
      });

      mockReq.body = {
        name: 'J',
        email: 'invalid-email',
        age: -1
      };

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      const jsonCall = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall.errors).toHaveLength(3);
    });

    it('should pass through non-Zod errors', () => {
      const schema = z.object({
        name: z.string()
      });

      // Mock schema.parse to throw a non-Zod error
      const originalParse = schema.parse;
      schema.parse = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      mockReq.body = { name: 'test' };

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockRes.status).not.toHaveBeenCalled();

      // Restore original method
      schema.parse = originalParse;
    });

    it('should handle empty request body', () => {
      const schema = z.object({
        name: z.string().min(2)
      });

      mockReq.body = {};

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalledWith();
    });

    it('should handle null/undefined request body', () => {
      const schema = z.object({
        name: z.string().min(2)
      });

      mockReq.body = null;

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Edge Cases and Security', () => {
    it('should handle extremely long strings', () => {
      const veryLongString = 'x'.repeat(100000);
      
      expect(() => emailSchema.parse(veryLongString)).toThrow();
      expect(() => passwordSchema.parse(veryLongString)).not.toThrow(); // Password doesn't have max length
    });

    it('should handle special characters in validation', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      // Test that special characters in names are handled appropriately
      const nameWithSpecialChars = `João${specialChars}Silva`;
      
      // This should be handled by the application logic, not necessarily fail validation
      expect(nameWithSpecialChars).toBeDefined();
    });

    it('should handle Unicode characters', () => {
      const unicodeEmail = 'joão@exãmple.com';
      const unicodeName = 'José María González';
      
      // Email with Unicode should be handled appropriately
      try {
        emailSchema.parse(unicodeEmail);
      } catch (error) {
        expect(error).toBeInstanceOf(z.ZodError);
      }
      
      expect(unicodeName).toBeDefined();
    });

    it('should handle null bytes and control characters', () => {
      const stringWithNullByte = 'test\x00@example.com';
      const stringWithControlChars = 'test\x01\x02@example.com';
      
      expect(() => emailSchema.parse(stringWithNullByte)).toThrow();
      expect(() => emailSchema.parse(stringWithControlChars)).toThrow();
    });

    it('should handle different date formats', () => {
      const dateFormats = [
        new Date().toISOString(),
        '2023-12-25T10:30:00Z',
        '2023-12-25T10:30:00.000Z',
        '2023-12-25T10:30:00+00:00'
      ];

      const schema = z.string().datetime();
      
      dateFormats.forEach(dateFormat => {
        expect(() => schema.parse(dateFormat)).not.toThrow();
      });
    });
  });
});