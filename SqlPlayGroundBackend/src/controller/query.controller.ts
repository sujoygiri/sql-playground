import { NextFunction, Request, Response } from "express";
import { validationResult, matchedData } from "express-validator";

import * as db from "../db/connection.db";
import { isDbExist, updateUserSession } from "../utils/global.util";
import { AppError } from "../utils/errorHandler.util";

export const handelQueryRun = async (req: Request, res: Response, next: NextFunction) => {
    const sessionIdValidationResult = validationResult(req);
    if (sessionIdValidationResult.isEmpty()) {
        const clientData = matchedData(req, { onlyValidData: true });
        const sessionId = clientData['_ssid'];
        const query = clientData['query'];
        const isDbCreated = await isDbExist(sessionId);
        if(isDbCreated) {
            const dbClient = await db.getDbClient(sessionId);
            try {
                const result = await dbClient.query(query);
                res.setHeader('_ssid', sessionId);
                res.status(200).json({ rows: result.rows, command: result.command, count: result.rowCount, result })
            } catch (error: any) {
                console.log({ msg: error.message });
                throw new AppError(error.message);
            } finally {
                await dbClient.end();
                await updateUserSession(sessionId);
            }
        } else {
            throw new AppError("Db Error! Refresh the page.");
        }
    }
    else {
        throw new AppError("Session id not found or Invalid");
    }
}

export const getQueryHistory = async (req: Request, res: Response, next: NextFunction) => {
    const createDb = await db.poolQuery("INSERT INTO person (name) VALUES('joy') RETURNING *");
    res.status(200).json({ rows: createDb.rows, command: createDb.command, count: createDb.rowCount })
}
