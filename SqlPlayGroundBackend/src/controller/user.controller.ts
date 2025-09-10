import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";

import { createDb, createRole, createUserSession } from "../utils/global.util";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const sessionIdValidationResult = validationResult(req);
    if (sessionIdValidationResult.isEmpty()) {
        const sessionHeaderData = matchedData(req, { onlyValidData: true });
        let sessionId: string = sessionHeaderData['_ssid'];
        res.setHeader('_ssid', sessionId);
        res.status(200).json({ msg: 'success' })
    } else {
        let sessionId = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (let index = 0; index < 10; index++) {
            sessionId += characters[Math.ceil(Math.random() * characters.length) - 1];
        }
        await createUserSession(sessionId);
        await createRole(sessionId);
        await createDb(sessionId);
        res.setHeader('_ssid', sessionId);
        res.status(200).json({ msg: 'success' })
    }
}
// 