import bcrypt from "bcryptjs";
import { signToken } from "../middlewares/auth";
import { Request, Response } from "express";
import { sendMailWithTemplate } from "../utils/mail";
import cache from "../utils/cache";
import otpGenerator from "otp-generator";
import User from "../models/user.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { verifyGoogleToken } from "../utils/google";
import Cart from "../models/cart.model";

/**
  @desc    Register a new user
  @param   {Request} req - The request object containing user data
  @param   {Response} res - The response object used to send the response back to the client
  @returns {Promise<Response<any, Record<string, any>>>}
  @throws  {ApiError} If a user with the same email already exists or any other error occurs
*/
const register = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { name, email, mobile, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser)
    throw new ApiError(409, "User with same email already exists!");

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, mobile, password: hashedPwd });
    await newUser.save();
    const newCart = new Cart({ user: newUser._id });
    await newCart.save();
    await sendMailWithTemplate(
      email,
      "Thanks for signing up with My Ecom",
      "welcome.template",
      { name }
    );
    return res
      .status(201)
      .json(new ApiResponse(201, {}, "User Registered Successfully"));
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

/**
  @desc    Log in a user
  @param   {Request} req - The request object containing email and password
  @param   {Response} res - The response object used to send the response back to the client
  @returns {Promise<Response<any, Record<string, any>>>}
  @throws  {ApiError} If the user is not found or the password is incorrect
*/
const login = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) throw new ApiError(404, "User not found!");

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!isPasswordCorrect) throw new ApiError(401, "Incorrect Password");

  const token = signToken(existingUser);

  return res
    .status(200)
    .json(new ApiResponse(200, { token }, "User Logged In Successfully"));
};

/**
  @desc    Log in a user with Google
  @param   {Request} req - The request object containing Google credentials
  @param   {Response} res - The response object used to send the response back to the client
  @returns {Promise<void>}
  @throws  {ApiError} If an error occurs during the Google login process
*/
const loginWithGoogle = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.body?.credential) {
      const verificationResponse: any = verifyGoogleToken(req.body.credential);
      const profile = verificationResponse?.payload;
      console.log(profile);
    }
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

/**
  @desc    Send OTP for verification
  @param   {Request} req - The request object containing the user's email
  @param   {Response} res - The response object used to send the response back to the client
  @returns {Promise<Response<any, Record<string, any>>>}
  @throws  {ApiError} If the user is not found or any other error occurs
*/
const sendOTP = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { email } = req.body;
  try {
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found!");
    const subject = "My Ecom OTP";

    await sendMailWithTemplate(email, subject, "sendOtp.template", {
      otp,
      name: user.name,
    });

    cache.set(email, otp, 600);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Otp sent successfully !"));
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

/**
  @desc    Verify the OTP
  @param   {Request} req - The request object containing the user's email and OTP
  @param   {Response} res - The response object used to send the response back to the client
  @returns {Promise<Response<any, Record<string, any>>>}
  @throws  {ApiError} If the OTP is incorrect or any other error occurs
*/
const verifyOTP = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found!");

    if (cache.get(email) === otp) {
      cache.del(email);
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Otp verified successfully !"));
    } else {
      throw new ApiError(401, "Incorrect OTP !");
    }
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

/**
  @desc    Reset the user's password
  @param   {Request} req - The request object containing the user's email and new password
  @param   {Response} res - The response object used to send the response back to the client
  @returns {Promise<Response<any, Record<string, any>>>}
  @throws  {ApiError} If the user is not found or the new password is the same as the old password
*/
const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found!");

  try {
    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) {
      throw new ApiError(409, "New password cannot be same as old password");
    } else {
      const hashedPwd = await bcrypt.hash(password, 10);

      user.password = hashedPwd;

      await user.save();

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset successfully !"));
    }
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export default {
  register,
  login,
  loginWithGoogle,
  sendOTP,
  verifyOTP,
  resetPassword,
};
