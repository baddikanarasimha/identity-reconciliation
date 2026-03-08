import { Request, Response, NextFunction } from 'express';
import { AppError, ApiResponse } from '../types/contact.types';
import logger from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    ip: req.ip,
  });

  // Operational errors (known errors)
  if (err instanceof AppError && err.isOperational) {
    const response: ApiResponse<null> = {
      success: false,
      error: err.message,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Prisma errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as Error & { code?: string };
    let message = 'Database operation failed';
    let statusCode = 500;

    if (prismaError.code === 'P2002') {
      message = 'A record with this data already exists';
      statusCode = 409;
    } else if (prismaError.code === 'P2025') {
      message = 'Record not found';
      statusCode = 404;
    }

    res.status(statusCode).json({ success: false, error: message });
    return;
  }

  // Unexpected errors
  const response: ApiResponse<null> = {
    success: false,
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message || 'Internal server error',
  };

  res.status(500).json(response);
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
}
