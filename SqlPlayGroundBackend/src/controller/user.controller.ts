import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto"
import { createRole } from "../utils/global.util";


export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    let userSessionId = req.headers['_SSID'];
    if (!userSessionId) {
        userSessionId = crypto.randomBytes(10).toString('hex');
    }
    await createRole(userSessionId)
}
// 