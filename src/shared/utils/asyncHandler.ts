import type { NextFunction, Request, RequestHandler, Response } from 'express';

export const asyncHandler = (
  callback: (request: Request, response: Response, next: NextFunction) => Promise<void>,
): RequestHandler => {
  return (request, response, next) => {
    void callback(request, response, next).catch(next);
  };
};
