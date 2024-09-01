import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import { getUser, subscribeToNewsletter } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/current", verifyToken, getUser);
userRouter.post("/subscribe-to-newsletter", subscribeToNewsletter);

export default userRouter;
