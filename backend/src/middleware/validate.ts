// backend/src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { CONSTANTS } from '../config/constants';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: CONSTANTS.ERRORS.VALIDATION_ERROR,
      errors: errors.array().map(err => ({
        field: err.type === 'field' ? (err as any).path : undefined,
        message: err.msg,
      })),
    });
  };
};
