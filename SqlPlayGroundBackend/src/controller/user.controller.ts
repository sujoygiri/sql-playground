import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto"

export const createUserSession = (req: Request, res: Response, next: NextFunction) => {
    const userSessionId = crypto.randomUUID();
    
}

export const createDbToStoreUserData = (req: Request, res: Response, next: NextFunction) => {
    const queryString = ``
}