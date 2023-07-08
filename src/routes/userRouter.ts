import { Router } from "express";
import { verifyToken, checkAdmin } from "../middlewares/auth";
import {
  getAll,
  deleteUser,
  forgotPassword,
  updatePassword,
  deleteUserByEmail,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/user/get-all", getAll);
userRouter.delete(
  "/user/delete-user/:id",
  verifyToken as any,
  checkAdmin as any,
  deleteUser
);
userRouter.delete(
  "/user/delete-user-by-email",
  verifyToken as any,
  checkAdmin as any,
  deleteUserByEmail
);
userRouter.post("/user/forgot-password", forgotPassword);
userRouter.patch(
  "/user/update-password",
  verifyToken as any,
  updatePassword as any
);
export default userRouter;
