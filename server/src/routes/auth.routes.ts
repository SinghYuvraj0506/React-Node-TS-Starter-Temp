import { Router } from "express";
import { ensureGuest, verifyJWT } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";
import { loginUserSchema, registerUserSchema } from "../schemas/auth.schema";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller";

const authRouter = (router:Router) => {
    router.post('/auth/register',ensureGuest,validate(registerUserSchema),registerUser);
    router.post('/auth/login',ensureGuest,validate(loginUserSchema),loginUser);
    router.get('/auth/logout',verifyJWT,logoutUser);
}

export default authRouter;