import {NextFunction, Request, Response} from "express"

import * as db from "../db/connection.db"

export const handelQueryRun = (req:Request, res:Response, next:NextFunction) => {}

export const getQueryHistory = async (req:Request, res:Response, next:NextFunction) => {
    // const result = await db.query("SELECT NOW()")
    const createDb = await db.query("CREATE DATABASE testDB")
    res.status(200).json({rows:createDb.rows,command: createDb.command, count: createDb.rowCount})
}
