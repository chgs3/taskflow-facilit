import { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRequestHandler<
  Params = Record<string, string>,
  ResponseBody = unknown,
  RequestBody = unknown,
  RequestQuery = unknown
> = (
  request: Request<Params, ResponseBody, RequestBody, RequestQuery>,
  response: Response<ResponseBody>,
  next: NextFunction
) => Promise<unknown>;

export function asyncHandler<
  Params = Record<string, string>,
  ResponseBody = unknown,
  RequestBody = unknown,
  RequestQuery = unknown
>(
  handler: AsyncRequestHandler<
    Params,
    ResponseBody,
    RequestBody,
    RequestQuery
  >
): RequestHandler<Params, ResponseBody, RequestBody, RequestQuery> {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}