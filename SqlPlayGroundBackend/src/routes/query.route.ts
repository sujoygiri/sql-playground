import { Router } from "express"

import { getQueryHistory, handelQueryRun } from "../controller/query.controller";

export const queryRouter = Router();

queryRouter.post("/run-query", handelQueryRun);

queryRouter.get("/get-query-history", getQueryHistory)