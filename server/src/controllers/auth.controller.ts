import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { z } from "zod";
import { loginUserSchema, registerUserSchema } from "../schemas/auth.schema";
import prisma from "../config/db.config";
import { comparePassword, getJWTFromPayload, hashPassword } from "../utils/jwt";
import { cookieALlOptions } from "../utils/constants";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      body: { name, email, password },
    }: z.infer<typeof registerUserSchema> = req;

    let user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new ApiError(400, "Email is already registerd");
    }

    const newPassword = await hashPassword(password);

    if (!newPassword) {
      throw new ApiError(400, "Some error occurred");
    }

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: newPassword,
      },
    });

    //  setting jwt in cookie ------------
    const jwtData = getJWTFromPayload({
      id: user.id,
      email: user.email,
    });

    if (!jwtData) {
      throw new ApiError(400, "Some error occurred");
    }

    res
      .cookie("backend-token", jwtData.token, {
        expires: new Date(jwtData.expiry),
        ...cookieALlOptions,
      })
      .redirect(process.env.CLIENT_URL as string)
      // .json(
      //   new ApiResponse(200,user,"User registered successfully")
      // )
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { body:{email, password} }: z.infer<typeof loginUserSchema> = req;

  let user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid Credentials");
  }

  const checkPassword = await comparePassword(user.password, password)

  if (!checkPassword) {
    throw new ApiError(400, "Invalid Credentials");
  }

  //  setting jwt in cookie ------------
  const jwtData = getJWTFromPayload({
    id: user.id,
    email: user.email,
  });

  if (!jwtData) {
    throw new ApiError(400, "Some error occurred");
  }

  res
    .cookie("backend-token", jwtData.token, {
      expires: new Date(jwtData.expiry),
      ...cookieALlOptions,
    })
    .redirect(process.env.CLIENT_URL as string)
    // .json(
    //   new ApiResponse(200,user,"User logged in successfully")
    // )
});

export const getUserData = asyncHandler(
  async (req: Request, res: Response) => {
    const userData = req.user

    const user = await prisma.user.findUnique({
      where:{
        id:userData?.id
      },
      select:{
        name:true,
        email:true,
        id:true
      }
    })

    if(!user){
      throw new ApiError(400, "Some Error Occured, logout and try again");
    }
    
    res
      .json(
        new ApiResponse(200,{...user},"User fetched successfully")
      )
  }
);

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res
    .clearCookie('backend-token')
    .redirect(process.env.CLIENT_URL as string)
    // .json(
    //   new ApiResponse(200,null,"User logged out successfully")
    // )
});