import crypto from "node:crypto"
import { header, body } from "express-validator"

import { poolQuery } from "../db/connection.db";
import { AppError } from "./errorHandler.util";

export const ssidHeaderValidationChain = () => header("_ssid").trim().escape().isAlpha("en-US");
export const queryValidationChain = () => body("query").trim().notEmpty().isString();

export function getNewSessionId(): string {
    let sessionId = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let index = 0; index < 10; index++) {
        sessionId += characters[Math.ceil(Math.random() * characters.length) - 1];
    }
    return sessionId;
}

export function getHashedPassword(sessionId: string) {
    const passwordSalt = process.env.SALT
    if (passwordSalt && typeof passwordSalt === 'string') {
        const hashedPassword = crypto.scryptSync(sessionId, passwordSalt, 10).toString("hex");
        return hashedPassword;
    }
}

export async function createRole(sessionId: string) {
    try {
        const isRoleExistQuery = `SELECT rolname FROM pg_roles WHERE rolname=$1`;
        const isRoleExistQueryResult = await poolQuery(isRoleExistQuery, [sessionId]);
        if (isRoleExistQueryResult.rowCount !== 0) {
            return;
        } else {
            const hashedPassword = getHashedPassword(sessionId);
            // Escape identifiers and literals to prevent SQL injection
            // const safeSessionId = `"${sessionId.replace(/"/g, '""')}"`;
            // const safePassword = `'${hashedPassword.replace(/'/g, "''")}'`;
            const roleCreationQuery = `CREATE ROLE "${sessionId}" WITH LOGIN PASSWORD '${hashedPassword}' CONNECTION LIMIT 5`;
            await poolQuery(roleCreationQuery);
        }
    } catch (error: any) {
        console.log(error);
        throw new AppError(error);
    }
}

export async function createDb(sessionId: string) {
    try {
        const isDbCreated = await isDbExist(sessionId);
        if (!isDbCreated) {
            const dbCreationQuery = `CREATE DATABASE "${sessionId}" WITH OWNER='${sessionId}'`;
            await poolQuery(dbCreationQuery);
        }
    } catch (error: any) {
        console.log(error);
        throw new AppError(error);
    }
}

export async function isDbExist(sessionId: string) {
    try {
        const isDbExistQuery = `SELECT datname FROM pg_database WHERE datname=$1`;
        const isDbExistQueryResult = await poolQuery(isDbExistQuery, [sessionId]);
        return isDbExistQueryResult.rowCount ? true : false;
    } catch (error: any) {
        console.log(error);
        throw new AppError("");
    }
}

export async function isSessionExist(sessionId: string) {
    const isSessionExistQuery = `SELECT id FROM userdata WHERE id=$1`;
    const isSessionExistQueryResult = await poolQuery(isSessionExistQuery, [sessionId]);
    return isSessionExistQueryResult.rowCount ? true : false;
}

export async function storeUserSession(sessionId: string) {
    const createUserSessionQuery = `INSERT INTO userdata (id) VALUES ($1) ON CONFLICT (id) DO NOTHING`;
    await poolQuery(createUserSessionQuery, [sessionId]);
}

export async function updateUserSession(sessionId: string) {
    const sessionUpdateQuery = `UPDATE userdata SET last_login_time = CURRENT_TIMESTAMP WHERE id = $1`;
    await poolQuery(sessionUpdateQuery, [sessionId]);
}

export async function removeData() {
    const sessionRemoveQuery = `SELECT id FROM userdata WHERE last_login_time < NOW() - INTERVAL '7 days'`;
    const sessionRemoveQueryResult = await poolQuery(sessionRemoveQuery);
    console.log(sessionRemoveQueryResult.rows);
    const inactiveSessions = sessionRemoveQueryResult.rows;
    if (inactiveSessions.length && sessionRemoveQueryResult.rowCount) {
        for (let index = 0; index < inactiveSessions.length; index++) {
            const dbRemovalQuery = `DROP DATABASE IF EXISTS ${inactiveSessions[index]}`;
            await poolQuery(dbRemovalQuery);
            const roleRemoveQuery = `DROP ROLE IF EXISTS ${inactiveSessions[index]}`;
            await poolQuery(roleRemoveQuery);
        }
    }
}