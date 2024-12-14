import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next()
    } catch (e: any) {
      throw new ApiError(400,e?.errors[0]?.message);
    }
  };

export default validate;
