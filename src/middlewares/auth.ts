import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
import userModel from "../models/userModel";
import { Request, Response, NextFunction } from "express";
dotenv.config();
/***************************** WITH THE SIGNTOKEN TOKEN FUNCTION WE CAN CREATE A JWT TOKEN ***************************/
export const signToken = (user: any) => {
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

export const verifyToken = (req: User, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      return res.status(404).json({
        success: false,
        message: "Token not found !",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    //Authorization: 'Bearer TOKEN'
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decodedToken as JwtPayload;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkAdmin = async (
  req: User,
  res: Response,
  next: NextFunction
) => {
  try {
    let user = await userModel.findById(req.user.userId);
    if (user && !(user.role == "ADMIN")) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to perform this operation",
      });
    } else {
      next();
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
