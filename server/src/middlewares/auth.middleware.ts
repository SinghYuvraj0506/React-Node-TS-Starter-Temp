import { Request, NextFunction, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import jwt, { Secret } from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(
  async (req: Request, _, next: NextFunction) => {
    try {
      const accessToken =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!accessToken) {
        throw new ApiError(401, "Unauthorized Access!!!");
      }

      const decodedInfo: any = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as Secret
      );

      if (!decodedInfo || decodedInfo?.status !== 1) {
        throw new ApiError(400, "Unauthorized Access!!!");
      }

      req.user = decodedInfo as any;
      next();
    } catch (error: any) {
      throw new ApiError(401, error?.message || "Unauthorized Access!!!");
    }
  }
);

export const ensureGuest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    try {
      if (accessToken) {
        const data = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret);
        if (data) {
          return res.redirect(process.env.CLIENT_URL as string);
        }
      }
      return next();
    } catch (error) {
      return next();
    }
  }
);
