import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";
dotenv.config();
/***************************** WITH THE SIGNTOKEN TOKEN FUNCTION WE CAN CREATE A JWT TOKEN ***************************/

/**
 * Generates a JWT token for the given user.
 *
 * @param {any} user - The user object containing id and email.
 * @return {string} The generated JWT token.
 */
export const signToken = (user: any): string => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );
};
interface User extends Request {
  user: JwtPayload;
}
/***************************** WITH THIS VERIFY TOKEN FUNCTION WE CAN VERIFY IF THAT USER IS VALID OR NOT ***************************/

/**
 * Verifies the JWT token sent in the request headers.
 *
 * @param {Request & { user?: JwtPayload }} req - The request object containing the JWT token in the authorization header.
 * @param {Response} res - The response object used to send a response back to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @return {Response<any, Record<string, any>> | undefined}
 */
export const verifyToken = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> | undefined => {
  try {
    if (!req.headers.authorization) {
      throw new ApiError(401, "Unauthorized Request !");
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken: string | JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );
    req.user = decodedToken as JwtPayload;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
