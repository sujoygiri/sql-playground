import {Router} from "express";
import { createUser } from "../controller/user.controller";

const userRouter = Router();

userRouter.get("/create", createUser)


export default userRouter;