import { Router } from "express";
import {
  register,
  login,
  loginWithGoogle,
  sendOTP,
  verifyOTP,
  resetPassword,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);
authRouter.patch("/reset-password", resetPassword);
authRouter.get("/google", loginWithGoogle);
export default authRouter;
