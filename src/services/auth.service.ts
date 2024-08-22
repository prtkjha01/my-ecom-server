import bcrypt from "bcryptjs";
import { signToken } from "../middlewares/auth";
import { Request, Response } from "express";
import { sendMail, sendMailWithTemplate } from "../utils/mail";
import cache from "../utils/cache";
import otpGenerator from "otp-generator";
import User from "../models/user.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { google, verifyGoogleToken } from "../utils/google";
import Cart from "../models/cart.model";
const register = async (req: Request, res: Response) => {
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

const login = async (req: Request, res: Response) => {
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

const loginWithGoogle = async (req: Request, res: Response) => {
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

const sendOTP = async (req: Request, res: Response) => {
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
    const html = "Your OTP is :" + otp;

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

const verifyOTP = async (req: Request, res: Response) => {
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

const resetPassword = async (req: Request, res: Response) => {
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

const googleRedirect = async (req: Request, res: Response) => {};

export default {
  register,
  login,
  loginWithGoogle,
  sendOTP,
  verifyOTP,
  resetPassword,
};
