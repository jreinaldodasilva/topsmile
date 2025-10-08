import csrf from 'csurf';
import mongoSanitize from 'express-mongo-sanitize';

export const csrfProtection = csrf({ cookie: true });
export const mongoSanitization = mongoSanitize({
  replaceWith: '_',
  allowDots: false
});