import { Pool, PoolConfig, Client, ClientConfig } from "pg";

import { getHashedPassword } from "../utils/global.util";
import { AppError } from "../utils/errorHandler.util";

let poolConfig: PoolConfig = {};
console.log(process.env)
if(process.env.NODE_ENV === 'production') {
    const connectionString = `postgresql://${process.env.PGUSER}:${process.env.DB_PASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}?sslmode=require&channel_binding=require`;
    poolConfig = {
        connectionString,
    }
} else {
    poolConfig = {
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        port: Number(process.env.PGPORT),
    }
}

const pool = new Pool(poolConfig);

export const poolQuery = (text: string, params?: any[]) => pool.query(text, params);

export const getDbClient = async (sessionId: string)  => {
    try {
        const hashedPassword = getHashedPassword(sessionId);
        const clientConfig: ClientConfig = {
            host: process.env.PGHOST,
            user: sessionId,
            password: hashedPassword,
            database: sessionId,
            port: Number(process.env.PGPORT)
        }
        const dbClient = new Client(clientConfig);
        await dbClient.connect()
        return dbClient;
    } catch (error: any) {
        throw new AppError("Failed to create DB client", 500, error);
    }
} 
