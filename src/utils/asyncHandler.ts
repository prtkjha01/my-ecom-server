import { Request, Response, NextFunction, RequestHandler } from "express";


/**
 * This function is an async handler that takes a request handler and returns a request handler.
 *
 * @param {Function} requestHandler - the request handler function to be executed
 * @return {RequestHandler} a request handler function
 */
const asyncHandler =
  (requestHandler: Function): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
export default asyncHandler;

