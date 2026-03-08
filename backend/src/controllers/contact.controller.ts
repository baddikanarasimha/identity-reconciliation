import { Request, Response, NextFunction } from 'express';
import { contactService } from '../services/contact.service';
import { IdentifyRequest, ApiResponse, IdentifyResponse } from '../types/contact.types';
import logger from '../utils/logger';

export class ContactController {
  /**
   * POST /identify
   * Identify and reconcile customer identity
   */
  async identify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as IdentifyRequest;

      logger.info(`POST /identify - email=${body.email}, phone=${body.phoneNumber}`);

      const result = await contactService.identify({
        email: body.email ?? null,
        phoneNumber: body.phoneNumber ?? null,
      });

      const response: ApiResponse<IdentifyResponse> = {
        success: true,
        data: result,
      };

      res.status(200).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /health
   * Health check endpoint
   */
  healthCheck(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'identity-reconciliation-api',
      version: process.env.npm_package_version || '1.0.0',
    });
  }
}

export const contactController = new ContactController();
