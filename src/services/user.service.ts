import { Request, Response } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import User from "../models/user.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { sendMailWithTemplate } from "../utils/mail";

/**
 * Retrieves the authenticated user's details.
 *
 * @param {AuthorizedRequest} req - The incoming HTTP request, containing the authenticated user's info.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response<any, Record<string, any>>>} A promise resolving to the HTTP response with the user data.
 * @throws {ApiError} If the user is not found.
 */
const getUser = async (
  req: AuthorizedRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
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

/**
 * Subscribes a user to the newsletter by sending a confirmation email.
 *
 * @param {Request} req - The incoming HTTP request, containing the user's email in the body.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response<any, Record<string, any>>>} A promise resolving to the HTTP response indicating successful subscription.
 * @throws {ApiError} If sending the newsletter subscription email fails.
 */
const subscribeToNewsletter = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
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
