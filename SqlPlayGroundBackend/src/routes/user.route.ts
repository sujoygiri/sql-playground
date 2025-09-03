import {Router} from "express";
import { createUserSession } from "../controller/user.controller";

const userRouter = Router();

userRouter.get("/", createUserSession)


export default userRouter;