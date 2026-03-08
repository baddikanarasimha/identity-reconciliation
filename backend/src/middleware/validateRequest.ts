import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../types/contact.types';

export const identifySchema = z
  .object({
    email: z.string().email('Invalid email format').nullable().optional(),
    phoneNumber: z
      .string()
      .min(7, 'Phone number must be at least 7 characters')
      .max(15, 'Phone number must not exceed 15 characters')
      .regex(/^\+?[\d\s\-().]+$/, 'Invalid phone number format')
      .nullable()
      .optional(),
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: 'At least one of email or phoneNumber must be provided',
  });

export type IdentifySchema = z.infer<typeof identifySchema>;

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new ValidationError(`Validation failed: ${messages}`));
      } else {
        next(error);
      }
    }
  };
}
