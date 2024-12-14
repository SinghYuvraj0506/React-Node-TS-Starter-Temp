import { NextFunction, Request, RequestHandler, Response } from "express";

const asyncHandler = (requestHandler: RequestHandler) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      return await requestHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncHandler;
