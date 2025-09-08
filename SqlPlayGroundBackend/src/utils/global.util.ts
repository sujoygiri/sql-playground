import crypto from "node:crypto"
import { poolQuery } from "../db/connection.db";
import { AppError } from "./errorHandler.util";

export function getHashedPassword(sessionId: string) {
    const passwordSalt = process.env.SALT
    if( passwordSalt && typeof passwordSalt === 'string'){
        const hashedPassword = crypto.scryptSync(sessionId,passwordSalt,10).toString("hex");
        return hashedPassword;
    }
}

export async function createRole(sessionId: string) {
    try {
        const isRoleExistQuery = `SELECT rolname FROM pg_roles WHERE rolname=$1`;
        const isRoleExistQueryResult = await poolQuery(isRoleExistQuery,[sessionId]);
        if(isRoleExistQueryResult.rowCount !== 0) {
            return;
        } else {
            const hashedPassword = getHashedPassword(sessionId);
            // Escape identifiers and literals to prevent SQL injection
            // const safeSessionId = `"${sessionId.replace(/"/g, '""')}"`;
            // const safePassword = `'${hashedPassword.replace(/'/g, "''")}'`;
            const roleCreationQuery = `CREATE ROLE "${sessionId}" WITH LOGIN PASSWORD '${hashedPassword}' CONNECTION LIMIT 5`;
            await poolQuery(roleCreationQuery);
        }
    } catch (error) {
        console.log(error);
        throw new AppError(error);
    }
}

export async function createDb(sessionId: string) {
    try {
        const isDbExistQuery = `SELECT datname FROM pg_database WHERE datname=$1`;
        const isDbExistQueryResult = await poolQuery(isDbExistQuery,[sessionId]);
        if(isDbExistQueryResult.rowCount !== 0) {
            return;
        } else {
            // Set role to the sessionId before creating the database
            // await poolQuery(`SET ROLE "${sessionId}"`);
            const dbCreationQuery = `CREATE DATABASE "${sessionId}" WITH OWNER='${sessionId}'`;
            await poolQuery(dbCreationQuery);
        }
    } catch (error) {
        console.log(error);
        throw new AppError(error);
    }
}

export function isSessionIdValid(sessionId: string):boolean {
    const sessionIdRegex = /^[a-zA-Z]{10}$/;
    return sessionIdRegex.test(String(sessionId));
}

export async function createUserSession(sessionId: string) {
    const createUserSessionQuery = `INSERT INTO userdata (id) VALUES ($1) ON CONFLICT (id) DO NOTHING`;
    await poolQuery(createUserSessionQuery,[sessionId]);
}

export async function updateUserSession(sessionId: string) {
    const sessionUpdateQuery = `UPDATE userdata SET last_login_time = CURRENT_TIMESTAMP WHERE id = $1`;
    await poolQuery(sessionUpdateQuery, [sessionId]);
}

export async function removeUserSession() {
    const sessionRemoveQuery = `SELECT id FROM userdata WHERE last_login_time < NOW() - INTERVAL '7 days'`;
    const sessionRemoveQueryResult = await poolQuery(sessionRemoveQuery);
    console.log(sessionRemoveQueryResult.rows);
    
}