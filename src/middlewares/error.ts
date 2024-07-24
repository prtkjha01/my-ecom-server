import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
