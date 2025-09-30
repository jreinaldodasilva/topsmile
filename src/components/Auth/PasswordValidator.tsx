export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  const commonPasswords = [
    '12345678', 'password', 'password123', 'admin123',
    'qwerty123', '123456789', 'abc123456'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Senha muito comum. Escolha uma senha mais segura');
  }
  
  return errors;
};
