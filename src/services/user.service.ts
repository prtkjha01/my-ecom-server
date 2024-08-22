import { Request, Response } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import User from "../models/user.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { sendMailWithTemplate } from "../utils/mail";
const getUser = async (req: AuthorizedRequest, res: Response) => {
  const { userId: id } = req.user;
  const user = await User.findById(id);
  if (user) {
    return res
      .status(201)
      .json(new ApiResponse(201, user, "User Fetched Successfully"));
  } else {
    throw new ApiError(500, "User Not Found");
  }
};

const subscribeToNewsletter = async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log(email);

  try {
    await sendMailWithTemplate(
      email,
      "Welcome to MyEcom Newsletter",
      "newsletter.template",
      {}
    );

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully subscribed to newsletter"));
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export default {
  getUser,
  subscribeToNewsletter,
};
