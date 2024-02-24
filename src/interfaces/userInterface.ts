import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface User extends Request {
  user: JwtPayload;
}

export interface AuthorizedRequest extends Request {
  user: JwtPayload;
}
