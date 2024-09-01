import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

/**
 * A centralized error handling function for the application.
 * It catches and processes errors, sending a formatted error response to the client.
 *
 * @param {ApiError} err - The error object to be processed.
 * @param {Request} req - The request object associated with the error.
 * @param {Response} res - The response object used to send the error response.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @return {void | Response<any, Record<string, any>>}
 */
const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void | Response<any, Record<string, any>> => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  // Fallback to a generic error response if the error is not an instance of ApiError
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
    data: null,
  });
};

export default errorHandler;
