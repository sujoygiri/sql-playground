import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto"
import { createDb, createRole, isSessionIdValid } from "../utils/global.util";


export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    let sessionId = String(req.headers['_ssid']);
    if (!sessionId || !isSessionIdValid(sessionId)) {
        sessionId = crypto.randomBytes(10).toString('hex');
    }
    await createRole(sessionId);
    await createDb(sessionId);
    res.setHeader('_ssid',sessionId);
    res.status(200).json({msg:'success'})
}
// 