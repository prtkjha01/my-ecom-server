import { Router, Request, Response } from "express";
import productRouter from "./productRouter";
import authRouter from "./authRouter";
import userRouter from "./userRouter";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.send("<h1>Welcome to My E-com server</h1>");
});

router.use(productRouter);
router.use(authRouter);
router.use(userRouter);

/*********************************************************** UNDEFINED PATH HANDLER ********************************************************/
router.get("*", (req: Request, res: Response) => {
    res.status(404).json({
      status: 404,
      message: "Page not found",
    });
  });
  
  router.post("*", (req: Request, res: Response) => {
    res.status(404).json({
      status: 404,
      message: "Page not found",
    });
  });
  
  router.patch("*", (req: Request, res: Response) => {
    res.status(404).json({
      status: 404,
      message: "Page not found",
    });
  });
  
  router.put("*", (req: Request, res: Response) => {
    res.status(404).json({
      status: 404,
      message: "Page not found",
    });
  });
  
  router.delete("*", (req: Request, res: Response) => {
    res.status(404).json({
      status: 404,
      message: "Page not found",
    });
  });
  
export default router;
