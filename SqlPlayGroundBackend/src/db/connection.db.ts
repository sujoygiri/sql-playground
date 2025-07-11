import { Pool, PoolConfig} from "pg"

const connectionString = `postgresql://neondb_owner:${process.env.DB_PASSWORD}@ep-withered-bush-a1aqk8zu.ap-southeast-1.aws.neon.tech/sql-play-ground?sslmode=require&channel_binding=require`
const poolConfig: PoolConfig = {
    connectionString,
}

const pool = new Pool(poolConfig);

export const query = (text: string, params?:any[]) => pool.query(text, params);
