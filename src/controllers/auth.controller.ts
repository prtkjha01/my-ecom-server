import { Request, Response } from "express";
import authService from '../services/auth.service'
import asyncHandler from '../utils/asyncHandler'

export const register = asyncHandler(async (req: Request, res: Response) => {
    return authService.register(req, res); 
})

export const login = asyncHandler(async (req: Request, res: Response) => {
    return authService.login(req, res);
})