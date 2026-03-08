import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { validateBody, identifySchema } from '../middleware/validateRequest';

const router = Router();

/**
 * @route   POST /identify
 * @desc    Identify and reconcile customer identity
 * @access  Public
 * @body    { email?: string, phoneNumber?: string }
 */
router.post('/identify', validateBody(identifySchema), (req, res, next) =>
  contactController.identify(req, res, next)
);

/**
 * @route   GET /health
 * @desc    Health check
 * @access  Public
 */
router.get('/health', (req, res) => contactController.healthCheck(req, res));

export default router;
