import { Request, NextFunction, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { decodeJWT } from "../utils/jwt.js";
import jwt, { Secret } from "jsonwebtoken"
import ApiError from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(
  async (req: Request, _, next: NextFunction) => {
    try {
      const accessToken =
        req.cookies["backend-token"] ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!accessToken) {
        throw new ApiError(401, "Unauthorized Access!!!");
      }

      const data = decodeJWT(accessToken);

      if (!data) {
        throw new ApiError(400, "Unauthorized Access!!!");
      }

      req.user = data;
      next();
    } catch (error: any) {
      throw new ApiError(401, error?.message || "Unauthorized Access!!!");
    }
  }
);

export const ensureGuest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const accessToken =
    (req.cookies['backend-token']) ||
    req.header("Authorization")?.replace("Bearer ", "");

    try {
      if(accessToken){
         const data = jwt.verify(accessToken, process.env.JWT_SECRET as Secret);
         if(data){
           return res.redirect(process.env.CLIENT_URL as string);
         }
       }
       return next()
    } catch (error) {
      return next();
    }
  }
);
