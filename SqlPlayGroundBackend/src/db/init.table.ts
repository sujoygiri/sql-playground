import { poolQuery } from "./connection.db";

export const createRequiredTable = async () => {
    try {
        const userDataTableQuery = `
        CREATE TABLE IF NOT EXISTS userdata (
            id CHAR(10) PRIMARY KEY,
            last_login_time TIMESTAMPTZ DEFAULT NOW()
        );` 
        const queryHistoryTableQuery = `
        CREATE TABLE IF NOT EXISTS query_history (
            id SERIAL PRIMARY KEY,
            s_id CHAR(10) REFERENCES userdata(id) ON DELETE CASCADE,
            query_text TEXT,
            executed_at TIMESTAMPTZ DEFAULT NOW()
        );`
        await poolQuery(userDataTableQuery);
        await poolQuery(queryHistoryTableQuery);

    } catch (error) {
        console.log({error,from:'init-table',line:14});
    }
}