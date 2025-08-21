import {NextFunction, Request, Response} from "express"

import * as db from "../db/connection.db"

export const handelQueryRun = async (req:Request, res:Response, next:NextFunction) => {
    const {query} = req.body;
    console.log(query);
    const result = await db.query(query)
    res.status(200).json({rows:result.rows,command: result.command, count: result.rowCount})
}

export const getQueryHistory = async (req:Request, res:Response, next:NextFunction) => {
    // const result = await db.query("SELECT NOW()")
    const createDb = await db.query("INSERT INTO person (name) VALUES('joy') RETURNING *")
    res.status(200).json({rows:createDb.rows,command: createDb.command, count: createDb.rowCount})
}
