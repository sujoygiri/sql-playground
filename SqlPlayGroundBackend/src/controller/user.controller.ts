import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";

import { createDb, createRole, storeUserSession, getNewSessionId, isSessionExist } from "../utils/global.util";
import { AppError } from "../utils/errorHandler.util";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const sessionIdValidationResult = validationResult(req);
    if (sessionIdValidationResult.isEmpty()) {
        const sessionHeaderData = matchedData(req, { onlyValidData: true });
        let sessionId: string = sessionHeaderData['_ssid'];
        const isSessionCreated = await isSessionExist(sessionId);
        if (isSessionCreated) {
            res.setHeader('_ssid', sessionId);
            res.status(200).json({ msg: 'success' });
        } else {
            const sessionId = getNewSessionId();
            await storeUserSession(sessionId);
            await createRole(sessionId);
            await createDb(sessionId);
            res.setHeader('_ssid', sessionId);
            res.status(200).json({ msg: 'success' });
        }
    } else {
        console.log(sessionIdValidationResult.array());
        
        throw new AppError("Invalid Session")
    }
}
// 