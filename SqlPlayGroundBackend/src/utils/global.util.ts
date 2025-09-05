import crypto from "node:crypto"

import { poolQuery } from "../db/connection.db";

function getHashedPassword(sessionId: string): string {
    const salt = String(process.env.SALT);
    const hashedPassword = crypto.scryptSync(sessionId,salt,10).toString("hex");
    return hashedPassword;
}

export async function createRole(sessionId: string) {
    try {
        const isRoleExistQuery = `SELECT rolname FROM pg_roles WHERE rolname=$1`;
        const isRoleExistQueryResult = await poolQuery(isRoleExistQuery,[sessionId]);
        if(isRoleExistQueryResult.rowCount !== 0) {
            return;
        } else {
            const hashedPassword = getHashedPassword(sessionId);
            const roleCreationQuery = `CREATE ROLE $1 WITH LOGIN PASSWORD $2 CONNECTION LIMIT 5`;
            await poolQuery(roleCreationQuery,[sessionId, hashedPassword]);
        }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function createDb(sessionId: string) {
    try {
        const isDbExistQuery = `SELECT datname FROM pg_database WHERE datname=$1`;
        const isDbExistQueryResult = await poolQuery(isDbExistQuery,[sessionId]);
        if(isDbExistQueryResult.rowCount !== 0) {
            return;
        } else {
            const dbCreationQuery = `CREATE DATABASE $1 WITH OWNER=$1 CONNECTION LIMIT=5`;
            await poolQuery(dbCreationQuery,[sessionId]);
        }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}
