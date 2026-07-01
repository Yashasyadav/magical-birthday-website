import { Router } from 'express';
import { submitFeedback } from '../controllers/feedbackController.js';
import { validateFeedback } from '../middleware/validation.js';
import { feedbackSubmissionLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Route mappings with strict spam protection & input validations
router.post('/feedback', feedbackSubmissionLimiter, validateFeedback, submitFeedback);

export default router;
