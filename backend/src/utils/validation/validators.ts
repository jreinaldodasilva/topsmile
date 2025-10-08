import mongoose from 'mongoose';

export const commonValidators = {
  email: {
    validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    message: 'E-mail inválido'
  },

  required: (field: string) => [true, `${field} é obrigatório`],

  minLength: (field: string, min: number) => [min, `${field} deve ter pelo menos ${min} caracteres`],

  maxLength: (field: string, max: number) => [max, `${field} deve ter no máximo ${max} caracteres`],

  password: {
    validator: (password: string) => {
      return password.length >= 8 &&
             /(?=.*[A-Z])/.test(password) &&
             /(?=.*[a-z])/.test(password) &&
             /(?=.*\d)/.test(password);
    },
    message: 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número'
  }
};

export const emailField = {
  type: mongoose.Schema.Types.String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true,
  validate: commonValidators.email
};

export const passwordField = {
  type: mongoose.Schema.Types.String,
  required: true,
  minlength: 6
};
