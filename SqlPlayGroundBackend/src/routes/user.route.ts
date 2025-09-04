import {Router} from "express";
import { createUserRole } from "../controller/user.controller";

const userRouter = Router();

userRouter.get("/create-role", createUserRole)


export default userRouter;