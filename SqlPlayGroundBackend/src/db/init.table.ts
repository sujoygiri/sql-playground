import { poolQuery } from "./connection.db";

export const createUserDataTable = async () => {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS userdata (
            id CHAR(10) PRIMARY KEY,
            password CHAR(10) NOT NULL,
            last_login_time TIMESTAMP WITH TIME ZONE
        );
        ` 
        return await poolQuery(query)
    } catch (error) {
        console.log({error,from:'init-table',line:14});
    }
}