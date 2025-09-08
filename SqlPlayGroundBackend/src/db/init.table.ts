import { poolQuery } from "./connection.db";

export const createUserDataTable = async () => {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS userdata (
            id CHAR(10) PRIMARY KEY,
            last_login_time TIMESTAMPTZ DEFAULT NOW()
        );
        ` 
        return await poolQuery(query)
    } catch (error) {
        console.log({error,from:'init-table',line:14});
    }
}