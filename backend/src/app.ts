import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { apiRateLimiter } from './config/security';
import { swaggerSpec } from './docs/swagger';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { routes } from './routes';

export const app = express();

app.disable('x-powered-by');

app.use(helmet());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(
  express.json({
    limit: '100kb'
  })
);

app.use(apiRateLimiter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);