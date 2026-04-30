import rateLimit from 'express-rate-limit';
import { env } from './env';

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many requests. Please try again later.'
  }
});