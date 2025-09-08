import { Request, Response, NextFunction } from "express";

import { createDb, createRole, createUserSession, isSessionIdValid } from "../utils/global.util";


export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    let sessionId = req.headers['_ssid'] ?? '';
    if (Array.isArray(sessionId)) {
        sessionId = sessionId[0] ?? '';
    }
    if (!sessionId || !isSessionIdValid(sessionId)) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for(let index = 0; index < 10; index++) {
            sessionId += characters[Math.ceil(Math.random() * characters.length) - 1];
        }
    }
    await createUserSession(sessionId);
    await createRole(sessionId);
    await createDb(sessionId);
    res.setHeader('_ssid',sessionId);
    res.status(200).json({msg:'success'})
}
// 