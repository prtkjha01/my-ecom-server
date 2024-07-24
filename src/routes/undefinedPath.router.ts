import { Router, Request, Response } from "express";
import ApiError from "../utils/ApiError";

const undefinedPathHandler = Router();

undefinedPathHandler.get("/", (req: Request, res: Response) => {
  res.send("<h1>Welcome to My E-com server</h1>");
});

undefinedPathHandler.get("*", (req: Request, res: Response) => {
  throw new ApiError(404, "Page not found!");
});

undefinedPathHandler.post("*", (req: Request, res: Response) => {
  throw new ApiError(404, "Page not found!");
});

undefinedPathHandler.patch("*", (req: Request, res: Response) => {
  throw new ApiError(404, "Page not found!");
});

undefinedPathHandler.put("*", (req: Request, res: Response) => {
  throw new ApiError(404, "Page not found!");
});

undefinedPathHandler.delete("*", (req: Request, res: Response) => {
  throw new ApiError(404, "Page not found!");
});

export default undefinedPathHandler;
