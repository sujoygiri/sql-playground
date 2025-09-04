import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto"

export const createUserRole = (req: Request, res: Response, next: NextFunction) => {
    const userSessionId = crypto.randomBytes(10).toString("hex");
    const hashedPassword = crypto.scryptSync(userSessionId,"salt",10).toString("hex")
    const createUserRoleQuery = `CREATE ROLE ${userSessionId} WITH LOGIN PASSWORD ${hashedPassword}`;
    
}
