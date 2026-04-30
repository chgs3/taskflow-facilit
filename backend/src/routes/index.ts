import { Router } from 'express';

import { healthRoutes } from './health.routes';
import { taskRoutes } from './task.routes';

export const routes = Router();

routes.use(healthRoutes);
routes.use(taskRoutes);