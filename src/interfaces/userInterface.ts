import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";

export interface User extends Request {
  user: JwtPayload;
}
