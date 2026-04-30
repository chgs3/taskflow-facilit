import { Request, Response } from 'express';

export function notFoundHandler(request: Request, response: Response) {
  return response.status(404).json({
    message: `Route ${request.method} ${request.originalUrl} not found.`
  });
}