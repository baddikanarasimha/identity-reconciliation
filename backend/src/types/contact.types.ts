import { Contact, LinkPrecedence } from '@prisma/client';

// ─── Request / Response Types ──────────────────────────────────────────────

export interface IdentifyRequest {
  email?: string | null;
  phoneNumber?: string | null;
}

export interface ConsolidatedContact {
  primaryContatctId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

export interface IdentifyResponse {
  contact: ConsolidatedContact;
}

// ─── Repository Types ──────────────────────────────────────────────────────

export interface CreateContactInput {
  email?: string | null;
  phoneNumber?: string | null;
  linkedId?: number | null;
  linkPrecedence: LinkPrecedence;
}

export interface UpdateContactInput {
  linkedId?: number;
  linkPrecedence?: LinkPrecedence;
  deletedAt?: Date;
}

// ─── Service Types ─────────────────────────────────────────────────────────

export interface ReconciliationResult {
  primaryContact: Contact;
  allContacts: Contact[];
}

// ─── Error Types ───────────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 500, false);
  }
}

// ─── API Response Wrapper ──────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
