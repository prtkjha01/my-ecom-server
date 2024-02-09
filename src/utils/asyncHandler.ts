import { Request, Response, NextFunction } from "express";

/**
 * Wraps an async request handler to ensure any errors are caught and passed to the next middleware.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 * @return {void} 
 */
const asyncHandler = (requestHandler) => {
  (req: Request, res: Response, next: NextFunction) => {
    
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
// const asyncHandler =
//   (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await fn(req, res, next);
//     } catch (error: any) {
//       return res.status(error.code || 500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };
