import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { z } from "zod";
import { loginUserSchema, registerUserSchema } from "../schemas/auth.schema";
import prisma from "../config/db.config";
import {
  comparePassword,
  generateAccessAndRefreshTokens,
  hashPassword,
} from "../utils/jwt";
import { cookieOption } from "../utils/constants";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { google } from "googleapis";
import axios from "axios";
import jwt from "jsonwebtoken";

const googleOAuthClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Google auth ------------------------
export const authGoogle = asyncHandler((req: Request, res: Response) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const authorizationUrl = googleOAuthClient.generateAuthUrl({
    access_type: "online",
    scope: scopes,
  });

  return res.redirect(authorizationUrl);
});


export const googleCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const { code } = req.query;

    try {
      if (!code) {
        throw new ApiError(401, "Code not found, Some Error Occured");
      }

      let { tokens } = await googleOAuthClient.getToken(code as string);

      const { data: profile } = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }
      );

      if (!profile) {
        throw new ApiError(400, "Error in Google Login");
      }

      const user = await prisma.user.upsert({
        where: { email: profile?.email },
        create: {
          email: profile?.email,
          name: profile?.name,
          image: profile?.picture,
          provider: "GOOGLE",
        },
        update: {
          name: profile?.name,
          image: profile?.picture,
        },
      });

      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens({
          id: user?.id,
          name: user?.name,
          email: user?.email,
          status: user?.status,
        });

      if (!accessToken || !refreshToken) {
        throw new ApiError(400, "Error in Google Login");
      }

      return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOption)
        .cookie("refreshToken", refreshToken, cookieOption)
        .redirect(`${process.env.SUCCESS_REDIRECT_URL}`);
    } catch (error) {
      console.log(error);
      res.redirect(`${process.env.ClIENT_URL}`);
    }
  }
);

// credentials auth --------------------------------------------------
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
        provider: "CREDENTIALS",
      },
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      status: user?.status,
    });

    if (!accessToken || !refreshToken) {
      throw new ApiError(400, "Error in Credentials Signup");
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOption)
      .cookie("refreshToken", refreshToken, cookieOption)
      .redirect(`${process.env.SUCCESS_REDIRECT_URL}`);
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const {
    body: { email, password },
  }: z.infer<typeof loginUserSchema> = req;

  let user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user || !user?.password) {
    throw new ApiError(400, "Invalid Credentials");
  }

  const checkPassword = await comparePassword(user.password, password);

  if (!checkPassword) {
    throw new ApiError(400, "Invalid Credentials");
  }

  //  setting jwt in cookie ------------
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens({
    id: user?.id,
    name: user?.name,
    email: user?.email,
    status: user?.status,
  });

  if (!accessToken || !refreshToken) {
    throw new ApiError(400, "Error in Credentials Login");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOption)
    .cookie("refreshToken", refreshToken, cookieOption)
    .redirect(`${process.env.SUCCESS_REDIRECT_URL}`);
});

export const getUserData = asyncHandler(async (req: Request, res: Response) => {
  const userData = req.user;

  const user = await prisma.user.findUnique({
    where: {
      id: userData?.id,
    },
    select: {
      name: true,
      email: true,
      id: true,
      status: true,
    },
  });

  if (!user || user?.status !== 1) {
    throw new ApiError(400, "Some Error Occured, logout and try again");
  }

  res.json(new ApiResponse(200, { ...user }, "User fetched successfully"));
});

// user logout --------------------------
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  await prisma.user.update({
    where: { id: req.user?.id },
    data: {
      refreshToken: null,
    },
  });
  return res
    .status(200)
    .clearCookie("accessToken", cookieOption)
    .clearCookie("refreshToken", cookieOption)
    .redirect(process.env.CLIENT_URL as string);
});

// refresh user token --------------------------
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

      if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request!!!");
      }

      const decodedInfo: any = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      );

      if (!decodedInfo || decodedInfo?.status !== 1) {
        throw new ApiError(400, "Unauthorized Access!!!");
      }

      let user = await prisma.user.findUnique(decodedInfo?.id);

      if (!user || user.status !== 1) {
        throw new ApiError(401, "Unauthorized Access!!!");
      }

      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Invalid/Expired Session");
      }

      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens({
          id: user?.id,
          name: user?.name,
          email: user?.email,
          status: user?.status,
        });

      res
        .status(200)
        .cookie("accessToken", accessToken, cookieOption)
        .cookie("refreshToken", refreshToken, cookieOption)
        .json(new ApiResponse(200, {}, "Access Token Refreshed"));
    } catch (error: any) {
      throw new ApiError(401, error?.message || "Error in Refreshing Token");
    }
  }
);
