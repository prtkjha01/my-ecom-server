import { Router, Request, Response } from "express";

const undefinedPathHandler = Router();

undefinedPathHandler.get("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
});

undefinedPathHandler.post("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
});

undefinedPathHandler.patch("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
});

undefinedPathHandler.put("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
});

undefinedPathHandler.delete("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
});

export default undefinedPathHandler;
