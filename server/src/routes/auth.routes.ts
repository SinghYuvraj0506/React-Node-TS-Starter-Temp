import { Router } from "express";
import { ensureGuest, verifyJWT } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";
import { loginUserSchema, registerUserSchema } from "../schemas/auth.schema";
import { authGoogle, getUserData, googleCallback, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/auth.controller";

const authRouter = (router:Router) => {
    router.get('/auth/google',ensureGuest,authGoogle);
    router.post('/auth/google/callback',ensureGuest,googleCallback);

    router.post('/auth/register',ensureGuest,validate(registerUserSchema),registerUser);
    router.post('/auth/login',ensureGuest,validate(loginUserSchema),loginUser);

    router.get('/auth/me',verifyJWT,getUserData);
    router.get('/auth/logout',verifyJWT,logoutUser);

    router.get('/auth/refresh',refreshAccessToken);
}

export default authRouter;
