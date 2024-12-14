import jwt, { JwtPayload } from "jsonwebtoken";
import moment from "moment";
import bcrypt from "bcryptjs";

export const getJWTFromPayload = (payload: JwtPayload) => {
  try {
    const res = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "10 days",
    });
    return { token: res, expiry: moment().add(10, "day").valueOf() };
  } catch (error) {
    console.log("Error in signing jwt");
    return false;
  }
};

export const decodeJWT = (token: string) => {
  try {
    const decodedInfo = jwt.verify(token, process.env.JWT_SECRET as string);

    return decodedInfo as { id: string };
  } catch (error) {
    console.log("Error in signing jwt");
    return false;
  }
};

export const hashPassword = async (password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    return hashedPassword;
  } catch (error) {
    console.log("Error in hashing password");
    return false;
  }
};

export const comparePassword = async (hash: string, password: string) => {
  try {
    const bool = await bcrypt.compare(password, hash);

    return bool;
  } catch (error) {
    console.log("Error in comparing password");
    return false;
  }
};
