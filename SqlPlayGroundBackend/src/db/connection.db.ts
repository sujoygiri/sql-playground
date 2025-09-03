import { Pool, PoolConfig, Client, ClientConfig } from "pg"

// const connectionString = `postgresql://neondb_owner:${process.env.DB_PASSWORD}@ep-withered-bush-a1aqk8zu.ap-southeast-1.aws.neon.tech/sql-play-ground?sslmode=require&channel_binding=require`
const poolConfig: PoolConfig = {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT)
    // connectionString,
}

const pool = new Pool(poolConfig);

export const poolQuery = (text: string, params?: any[]) => pool.query(text, params);

export const getDbClient = (userDetails: { sessionId: string, password: string, dbName: string }): Client => {
    const clientConfig: ClientConfig = {
        host: process.env.PGHOST,
        user: userDetails.sessionId,
        password: userDetails.password,
        database: userDetails.dbName,
        port: Number(process.env.PGPORT)
    }
    const dbClient = new Client(clientConfig);
    return dbClient;
} 
