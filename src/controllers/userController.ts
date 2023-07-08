import { Request, Response } from "express";
import { User } from "../interfaces/userInterface";
import userService from "../services/user.service";

/********************** GET ALL FUNCTION, TO GET ALL THE USERS IN OUR DATABSE, ONLY ADMIN HAVE THE AUTHORITY TO CALL THIS FUNCTION***************************/
export const getAll = async (req: Request, res: Response) => {
  return userService.getAll(req, res);
};

/***************************** UPDATE FUNCTION, IF USER WANTS TO UPDATE HIS/HER ANY FIELD ***************************/
export const updateUser = async (req: Request, res: Response) => {
  return userService.updateUser(req, res);
};
/*************************************************************DELETE USER*****************************************************************/
export const deleteUser = async (req: Request, res: Response) => {
  return userService.deleteUser(req, res);
};
/*************************************************************DELETE USER by EMAIL*****************************************************************/
export const deleteUserByEmail = async (req: Request, res: Response) => {
  return userService.deleteUserByEmail(req, res);
};

export const forgotPassword = async (req: Request, res: Response) => {
  return userService.forgotPassword(req, res);
};

export const updatePassword = async (req: User, res: Response) => {
  return userService.updatePassword(req, res);
};
