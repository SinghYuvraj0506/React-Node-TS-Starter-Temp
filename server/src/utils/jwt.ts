import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ApiError from "./ApiError";
import prisma from "../config/db.config";

export const generateAccessAndRefreshTokens = async (payload: JwtPayload) => {
  try {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    if(!payload?.email){
      throw new Error("Invalid Request")
    }

    await prisma.user.update({
      where:{email:payload?.email},
      data:{
        refreshToken
      }
    })

    return {accessToken, refreshToken};
  } catch (error) {
    console.log(error)
    throw new ApiError(500, "Something went wrong in authorization");
  }
}

export const hashPassword = async (password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    return hashedPassword;
  } catch (error) {
    console.log(error)
    throw new ApiError(500, "Error in hashing password");
  }
};


export const comparePassword = async (hash: string, password: string) => {
  try {
    const bool = await bcrypt.compare(password, hash);

    return bool;
  } catch (error) {
    console.log(error)
    throw new ApiError(500, "Error in comparing password");
  }
};
