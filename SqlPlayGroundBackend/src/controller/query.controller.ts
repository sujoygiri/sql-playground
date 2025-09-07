import { NextFunction, Request, Response } from "express"

import * as db from "../db/connection.db"
import { createDb, createRole, isSessionIdValid } from "../utils/global.util";
import { AppError } from "../utils/errorHandler.util";

export const handelQueryRun = async (req: Request, res: Response, next: NextFunction) => {
    let sessionId = String(req.headers['_ssid']);
    const { query } = req.body;
    if (!isSessionIdValid(sessionId)) {
        throw new AppError("Session id not found or Invalid")
    }
    await createRole(sessionId);
    await createDb(sessionId);
    const dbClient = await db.getDbClient(sessionId);
    try {
        const result = await dbClient.query(query);
        res.setHeader('_ssid', sessionId);
        res.status(200).json({ rows: result.rows, command: result.command, count: result.rowCount })
    } catch (error) {
        console.log({msg:error.message});
        
        throw new AppError(error.message)
    } finally {
        await dbClient.end();
    }
}

export const getQueryHistory = async (req: Request, res: Response, next: NextFunction) => {
    // const result = await db.query("SELECT NOW()")
    const createDb = await db.poolQuery("INSERT INTO person (name) VALUES('joy') RETURNING *");
    res.status(200).json({ rows: createDb.rows, command: createDb.command, count: createDb.rowCount })
}
