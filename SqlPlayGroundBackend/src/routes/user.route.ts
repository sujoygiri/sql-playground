import {Router} from "express";

import { createUser } from "../controller/user.controller";
import { ssidHeaderValidationChain } from "../utils/global.util";

const userRouter = Router();


userRouter.get("/create", ssidHeaderValidationChain(), createUser)

export default userRouter;