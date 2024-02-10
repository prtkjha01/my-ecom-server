import { Router } from "express";
import { verifyToken, checkAdmin } from "../middlewares/auth";
import {
  register,
  login
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post('/register', register)
authRouter.post('/login', login)

export default authRouter;
