import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
// import userModel from "../models/userModel";
import { signToken } from "../middlewares/auth";
import { Request, Response } from "express";
import sendMail from "../utils/mail";
import otpGenerator from "otp-generator";
import OtpModel from "../models/otpModel";
import mongoose from "mongoose";
// import { User } from "../interfaces/userInterface";
import User from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { google, verifyGoogleToken } from "../utils/google";
import { log } from "console";
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

const googleRedirect = async (req: Request, res: Response) => {};
const signup = async (req: Request, res: Response) => {};

// const signup = async (req: Request, res: Response) => {
//   try {
//     const existingUser = await userModel.findOne({ email: req.body.email }); // CHECKS FOR THE EXISTING USER IN OUR DATABASE
//     if (existingUser) {
//       return res.status(400).json({
//         status: 400,
//         message: "Account Already exists",
//       });
//     } else if (
//       req.body.name.length === 0 ||
//       req.body.age < 1 ||
//       req.body.email.includes("@") === false
//     ) {
//       return res.status(400).json({
//         status: 400,
//         message: "incorrect credentials",
//       });
//     }
//     const newUser = new userModel(req.body); // CRETATED NEW INSTANCE OF USER
//     const hashedPwd = await bcrypt.hash(req.body.password, 10); // CONFIGURED BCRYPT HASH METHOD TO STORE PASSWORD IN DATABAS EAFTER ENCODING
//     newUser.password = hashedPwd;
//     newUser.createdAt = new Date();
//     //return new Date()
//     // let otp = otpGenerate()
//     // let mobile = req.body.mobile;
//     // await sendMsg(mobile, otp)
//     let token = signToken(newUser); // CALLING SIGNTOKEN FUNCTION TO HAVE A JWT FOR THIS PARTICULAR USER
//     await newUser.save(); // AFTER CREATING THE USER, SAVE THAT USER IN OUR DATABASE
//     return res.status(201).json({
//       success: true,
//       data: {
//         userId: newUser.id,
//         email: newUser.email,
//         token: token,
//         createdAt: newUser.createdAt,
//       },
//     });
//   } catch (err: any) {
//     return res.status(500).json({
//       message: err.message,
//     });
//   }
// };

// const login = async (req: Request, res: Response) => {
//   try {
//     let { email, password } = req.body;
//     let existingUser = await userModel.findOne({ email: email }); //CHECKS FOR THE EXISTING USER IN OUR DATABASE
//     if (!existingUser) {
//       return res.status(404).json({
//         status: 404,
//         message: "Wrong email or password",
//       });
//     }
//     if (!email || !password) {
//       return res.status(400).json({
//         status: 400,
//         message: "Please provide all details i.e. email and password",
//       });
//     }
//     let token = signToken(existingUser); // CALLING SIGNTOKEN FUNCTION TO HAVE A JWT FOR THIS PARTICULAR USER
//     if (existingUser) {
//       const cmp = await bcrypt.compare(password, existingUser.password); // CHECKS FOR THE PASSWORD IS THAT IS CORRECT OR NOT BY USING BCRYPT COMPARE METHOD
//       if (cmp) {
//         return res.status(200).json({
//           success: true,
//           data: {
//             status: 200,
//             message: "User login successful",
//             userId: existingUser.id,
//             email: existingUser.email,
//             token: token,
//           },
//         });
//       } else {
//         return res.status(403).json({
//           status: 403,
//           message: "Wrong Password",
//         });
//       }
//     }
//   } catch (err) {
//     return res.status(500).json({
//       status: 500,
//       message: "Error! Something went wrong",
//     });
//   }
// };

export default { register, signup, login, loginWithGoogle };
