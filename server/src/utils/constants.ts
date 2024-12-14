import { CookieOptions } from "express";

export const cookieALlOptions: () => CookieOptions = () => {
    if (process.env.NODE_ENV === "development"){
      return {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        domain:"localhost"
      };
    }
    
    else{
      return {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        // domain:"livetesting.tech"
      };
    }
  }