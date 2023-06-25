/***************************** HANDLED BUSINESS LOGIC IN THIS CONTROLLER FILE ***************************/
// import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel";
import { signToken } from "../middlewares/auth";
import { Request, Response } from "express";
import sendMail from "../utils/mail";
import otpGenerator from "otp-generator";
import OtpModel from "../models/otpModel";
import mongoose from "mongoose";
import { User } from "../interfaces/userInterface";

dotenv.config();
/***************************** SIGNUP FUNCTION, IF THE USER IS NEW ***************************/
export const signup = async (req: Request, res: Response) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email }); // CHECKS FOR THE EXISTING USER IN OUR DATABASE
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "Account Already exists",
      });
    } else if (
      req.body.name.length === 0 ||
      req.body.age < 1 ||
      req.body.email.includes("@") === false
    ) {
      return res.status(400).json({
        status: 400,
        message: "incorrect credentials",
      });
    }
    const newUser = new userModel(req.body); // CRETATED NEW INSTANCE OF USER
    const hashedPwd = await bcrypt.hash(req.body.password, 10); // CONFIGURED BCRYPT HASH METHOD TO STORE PASSWORD IN DATABAS EAFTER ENCODING
    newUser.password = hashedPwd;
    newUser.createdAt = new Date();
    //return new Date()
    // let otp = otpGenerate()
    // let mobile = req.body.mobile;
    // await sendMsg(mobile, otp)
    let token = signToken(newUser); // CALLING SIGNTOKEN FUNCTION TO HAVE A JWT FOR THIS PARTICULAR USER
    await newUser.save(); // AFTER CREATING THE USER, SAVE THAT USER IN OUR DATABASE
    return res.status(201).json({
      success: true,
      data: {
        userId: newUser.id,
        email: newUser.email,
        token: token,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

/***************************** LOGIN FUNCTION, IF THE USER IS ALREADY PRESENT IN OUR DATABASE ***************************/
export const login = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;
    let existingUser = await userModel.findOne({ email: email }); //CHECKS FOR THE EXISTING USER IN OUR DATABASE
    if (!existingUser) {
      return res.status(404).json({
        status: 404,
        message: "Wrong email or password",
      });
    }
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Please provide all details i.e. email and password",
      });
    }
    let token = signToken(existingUser); // CALLING SIGNTOKEN FUNCTION TO HAVE A JWT FOR THIS PARTICULAR USER
    if (existingUser) {
      const cmp = await bcrypt.compare(password, existingUser.password); // CHECKS FOR THE PASSWORD IS THAT IS CORRECT OR NOT BY USING BCRYPT COMPARE METHOD
      if (cmp) {
        return res.status(200).json({
          success: true,
          data: {
            status: 200,
            message: "User login successful",
            userId: existingUser.id,
            email: existingUser.email,
            token: token,
          },
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Wrong Password",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Error! Something went wrong",
    });
  }
};

/********************** GET ALL FUNCTION, TO GET ALL THE USERS IN OUR DATABSE, ONLY ADMIN HAVE THE AUTHORITY TO CALL THIS FUNCTION***************************/
export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await userModel.find({}); // FETCHING ALL USER FORM THE DATABASE
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

/***************************** UPDATE FUNCTION, IF USER WANTS TO UPDATE HIS/HER ANY FIELD ***************************/
export const updateUser = async (req: Request, res: Response) => {
  // const _id = decodedToken.userId
  try {
    const _id = req.params.id;
    const user = await userModel.findOne({ _id });
    if (user) {
      user.updatedAt = new Date();
      await user.updateOne(req.body); // UPDATE METHOD SO THAT USER GETS SUCCESSFULLY UPDATED IN THE DATABSE
    } else {
      return res.status(404).send("User Not Found");
    }
    let data = await userModel.findOne({ _id });
    return res.status(200).json({
      status: 200,
      message: "Successfully updated",
      data,
    });
  } catch (error) {
    return res.status(500).send("Something Went Wrong");
  }
};
/*************************************************************DELETE USER*****************************************************************/
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const user: any = await userModel.findOne({ _id });
    if (!user) {
      return res.status(404).send("User Not Found");
    } else {
      await userModel.findByIdAndDelete(user._id);

      return res.status(200).json({
        status: 200,
        message: `User named ${user.name} Deleted Successfully`,
        data: user,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong",
    });
  }
};
/*************************************************************DELETE USER by EMAIL*****************************************************************/
export const deleteUserByEmail = async (req: Request, res: Response) => {
  try {
    let { email } = req.query;
    const user: any = await userModel.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // await user.findOneAndDelete(user._id);

    return res.status(200).json({
      status: 200,
      message: `${user.name} deleted successfully`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    let otpInDb = await OtpModel.find({ otp });

    if (otpInDb.length > 0) {
      while (otpInDb.length > 0) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          specialChars: false,
        });
        otpInDb = await OtpModel.find({ otp });
      }
    }
    const { email } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found!",
      });
    }
    var id = existingUser._id;
    const otps = await OtpModel.find({ userId: id });

    if (otps.length >= 1) {
      for (var i = 0; i < otps.length; i++) {
        await OtpModel.findOneAndDelete(otps[i]._id);
      }

      await forgotPassword(req, res);
    } else {
      await sendMail(email, otp);
      const newOtp = new OtpModel();
      newOtp.otp = otp;
      newOtp.userId = existingUser._id;
      await newOtp.save();
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Mail sent, go to this link /otp/verifyOtp",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

export const updatePassword = async (req: User, res: Response) => {
  console.log("in here");

  try {
    let { userId } = req.user;
    let user = await userModel.findById(userId);
    let otp = await OtpModel.findOne({ userId });
    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      await user.save();
      await OtpModel.findOneAndDelete(otp._id);
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Password Updated",
      });
    } else {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
