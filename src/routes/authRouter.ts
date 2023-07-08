import { Router } from "express";
import { verifyToken, checkAdmin } from "../middlewares/auth";
import {
  signup,
  login,
  getAll,
  deleteUser,
  forgotPassword,
  updatePassword,
  deleteUserByEmail,
} from "../controllers/authController";

const authRouter = Router();

authRouter.post("/auth/signup", signup);
authRouter.post("/auth/login", login);
// authRouter.get("/users/get-all", getAll);
authRouter.delete(
  "/auth/delete-user/:id",
  verifyToken as any,
  checkAdmin as any,
  deleteUser
);
authRouter.delete(
  "/auth/delete-user-by-email",
  verifyToken as any,
  checkAdmin as any,
  deleteUserByEmail
);
authRouter.post("/auth/forgot-password", forgotPassword);
authRouter.patch(
  "/auth/update-password",
  verifyToken as any,
  updatePassword as any
);
export default authRouter;
