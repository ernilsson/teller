import {createPool, Pool} from "mysql";

export const init = (): Pool => {
    try {
        const pool = createPool({
            connectionLimit: 5,
            host: "localhost",
            user: "root",
            password: "root",
            database: "teller",
        })
        console.info("Created connection pool")
        return pool
    } catch (error) {
        console.error("Failed to create connection pool: ", error)
        throw new Error("Failed to create connection pool")
    }
}