import { Router } from "express"

import { getQueryHistory, handelQueryRun } from "../controller/query.controller";
import { queryValidationChain, ssidHeaderValidationChain } from "../utils/global.util";

export const queryRouter = Router();

queryRouter.post("/run-query", ssidHeaderValidationChain(), queryValidationChain(), handelQueryRun);

queryRouter.get("/get-query-history", getQueryHistory)